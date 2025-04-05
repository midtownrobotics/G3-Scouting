import express, { Request } from 'express';
import http from 'http';
import TheBlueAllianceV3 from 'thebluealliancev3';
import { WebSocketServer } from 'ws';
import { generateSchedule, setMatch } from './assigner';
import { earlyStartBlock, getCurrentScoutingBlock, SCOUTING_BLOCKS } from './blockManager';
import formDataHandler from './formDataHandler';
import ResponseModel from './models/ResponseModel';
import syncDatabase from './models/syncDatabase';
import UserModel from './models/UserModel';
import { getDeployedForms, getFormHTML, getSettings, getSettingsSync, writeSettings } from './storage';
import { AdminPostRequest, Assignment, GeneralPostRequest, Settings, UserGetData } from './types';
import slackRouter from './slack';
import startReminderSchedule from './reminders';
import { Op } from 'sequelize';
import ejs from 'ejs';
import path from 'path';

export const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let PORT: number = 9955;

/** Whether to show the "You are not currently scouting" page or not. */
const NOT_SCOUTING_PAGE = true;

export const TBA = new TheBlueAllianceV3(getSettingsSync().keys.theBlueAlliance);

interface AuthReq extends Request {
    user?: UserModel
}

syncDatabase().then(() => {
    startReminderSchedule()
})

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(slackRouter)

if (process.argv.indexOf("port") > -1) {
    PORT = parseInt(process.argv[process.argv.indexOf("port") + 1])
}

app.use(async function (req: AuthReq, res, next) {

    const allUsers = await UserModel.findAll()

    if (!allUsers[0] || !allUsers.find((user) => user.permissionId == 0)) {
        UserModel.addUser("admin", "password", 0, true)
    }

    const settings: Settings = await getSettings();

    if (!settings.permissionLevels[0]) {
        settings.permissionLevels.push({ name: "admin", blacklist: [] })
        writeSettings(settings)
    }

    let url: string = req.url;
    if (url.charAt(url.length - 1) == "/") {
        url = url.substring(0, url.length - 1)
    }

    const user = await getUserFromAuth(req.headers.authorization)

    if (!user) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="G3"');
        res.end('Unauthorized');
    } else {
        const blacklist = settings.permissionLevels[user.permissionId].blacklist
        let bad: boolean = false;

        if (!blacklist) {
            bad = true;
        } else {
            for (let i = 0; i < blacklist.length; i++) {
                if (url.includes(blacklist[i])) {
                    bad = true
                    break
                }
            }
        }

        if (bad) {
            res.render("401", { user: req.user });
        } else {
            req.user = user
            next();
        }
    }
});

async function getUserFromAuth(authHeader: string | undefined): Promise<UserModel | undefined> {
    if (!authHeader) return undefined;
    const auth = Buffer.from(authHeader.substring(6), 'base64').toString().split(':');
    const username = auth[0], password = auth[1];
    const users = await UserModel.findAll()
    return users.find((u) => u.username == username && u.password == password)
}

app.use(express.static(__dirname + '/../static/'));

app.get('/logout', (req, res) => {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="G3"');
    res.send('Unauthorized');
})

app.get('/forms', async (req: AuthReq, res) => {
    const user = req.user
    if (!user) return res.render("401");

    const currentMatch = (await getSettings()).match;

    const form: string | undefined = req.query.form?.toString()
    const deployedForms: string[] = await getDeployedForms()

    const currentBlock = await getCurrentScoutingBlock()

    if (NOT_SCOUTING_PAGE && (user.assignments?.find((a) => a.time == currentBlock)?.status || "break") == "break") {
        return res.render('form-no-scout', { user: req.user })
    } else if (form && deployedForms.includes(form)) {
        if (user.lastMatchScouted == currentMatch) {
            return res.render('form-waiting', { user: req.user })
        } else {
            return res.render('form', { data: await getFormHTML(form) });
        }
    } else if (deployedForms.length > 0) {
        return res.redirect(`/forms?form=${deployedForms[0]}`)
        // res.render('form-home', { sheets: deployedForms })
    }

    return res.render('form-home', { sheets: false })
})

app.get('/admin', async (req, res) => {
    const settings = await getSettings()
    const allUsers = await UserModel.findAll()
    const currentResponses = await ResponseModel.findAll({ where: { matchNum: settings.match } })
    const lastResponses = await ResponseModel.findAll({ where: { matchNum: settings.match - 1 } })
    const currentEvilScouts = allUsers.filter((s) => s.assignedMatches.includes(settings.match) && !currentResponses.some((m) => m.scoutId == s.id))
    const lastEvilScouts = allUsers.filter((s) => s.assignedMatches.includes(settings.match - 1) && !lastResponses.some((m) => m.scoutId == s.id))

    const html = await ejs.renderFile(path.join(__dirname, '/../views/admin.ejs'), {
        users: allUsers,
        matchReview: {
            current: {
                responses: currentResponses,
                evilScouts: currentEvilScouts,
                number: settings.match
            },
            last: {
                responses: lastResponses,
                evilScouts: lastEvilScouts,
                number: settings.match - 1
            }
        },
        times: SCOUTING_BLOCKS,
        perms: settings.permissionLevels,
        match: settings.match,
        earlyBlock: settings.earlyBlock != null,
        teamPriorityList: settings.teamPriority.join(", "),
        nextBlock: await getCurrentScoutingBlock(1),
    }, {
        async: true
    })

    res.send(html)
})

app.get('/settings', async (req: AuthReq, res) => {
    res.render("settings", { user: req.user })
})

app.get('/', async (req: AuthReq, res) => {
    const user = req.user;
    if (!user || !user.assignments) return res.render('schedule-error', { user: req.user });

    const currentScoutingBlock = await getCurrentScoutingBlock();
    const currentAssignment = user.assignments.findIndex((a) => a.time == currentScoutingBlock)

    let lastMatchingTime = "is over.";

    if (currentAssignment > 0) {
        if (user.assignments[currentAssignment + 1]) {
            lastMatchingTime = user.assignments[currentAssignment + 1].time
        }

        for (let i = currentAssignment + 1; i < user.assignments.length; i++) {
            if (user.assignments[i].status == user.assignments[currentAssignment].status) {
                if (!user.assignments[i + 1]) {
                    lastMatchingTime = "is over."
                } else {
                    lastMatchingTime = user.assignments[i + 1].time;
                }
            } else {
                break;
            }
        }
    }

    const currentAssignmentIndex = user.assignments.findIndex((a) => a.time == currentScoutingBlock)
    const assignments: Assignment[] = user.assignments.slice();
    assignments.splice(0, currentAssignmentIndex)

    return res.render('user', {
        username: user.username,
        schedule: assignments,
        current: {
            status: currentAssignment == -1 ? "Day over!" : user.assignments[currentAssignment]?.status,
            until: lastMatchingTime,
            time: currentScoutingBlock
        }
    })
})

app.get('/user-get', async (req: AuthReq, res) => {
    const user = req.user
    if (!user) return res.sendStatus(403);

    const data: UserGetData = {
        name: user.username,
        lastMatchScouted: user.lastMatchScouted,
        nextMatch: user.nextMatch
    }

    return res.send(data)
})

app.get('/forms-get', (req, res) => {
    res.sendFile(__dirname + "/storage/forms.json")
})

app.post('/post', async (req: AuthReq, res) => {
    const body = req.body as GeneralPostRequest
    const sendPostresponse = (postRes: any) => res.send(postRes);

    switch (body.action) {
        case "getKey":
            sendPostresponse({ key: (await getSettings()).eventKey })
            break
        case "getDayNumber":
            sendPostresponse({ dayNumber: (await getSettings()).dayNumber })
            break
        case "getBlocks":
            sendPostresponse({ blocks: SCOUTING_BLOCKS })
            break
        case "getCurrentMatch":
            sendPostresponse({ match: (await getSettings()).match })
            break
        case "postFormData":
            formDataHandler(body.data, req.user)
            sendPostresponse({ status: 'OK' })
            break
    }

})

async function isValidUser(userObject: UserModel) {
    const settings: Settings = await getSettings()
    return (
        !!userObject.username &&
        !!userObject.password &&
        userObject.permissionId < settings.permissionLevels.length
    )
}

app.post('/admin', async (req, res) => {
    const body: AdminPostRequest = req.body

    const sendPostresponse = (postRes: object) => res.send(postRes);

    switch (body.action) {
        case "editUserField":
            {
                const users = await UserModel.findAll()
                const user = users.find(p => p.id == body.data.id)
                if (!user) {
                    sendPostresponse({ status: "Bad User" });
                    return;
                }

                const field = body.data.field
                if (field == "permissionId") {
                    user[field] = parseInt(body.data.updated)
                } else if (field == "reliable") {
                    user[field] = body.data.updated == "true"
                } else {
                    user[field] = body.data.updated
                }

                if (await isValidUser(user)) {
                    user.save()
                    sendPostresponse({ status: "OK" })
                } else {
                    sendPostresponse({ status: "Bad User" });
                }
            }
            break
        case "addUser":
            {
                const settings: Settings = await getSettings()
                if (
                    !!body.data.username &&
                    !!body.data.password &&
                    body.data.permissionId < settings.permissionLevels.length
                ) {
                    UserModel.addUser(body.data.username, body.data.password, body.data.permissionId, body.data.reliable)
                    sendPostresponse({ status: "OK" })
                } else {
                    sendPostresponse({ status: "Bad User" });
                }
            }
            break
        case "deleteUser":
            await (await UserModel.findOne({ where: { id: body.data } }))?.destroy()
            sendPostresponse({ status: "OK" })
            break
        case "addPerm":
            {
                const settings: Settings = await getSettings()
                settings.permissionLevels.push({
                    name: body.data.name,
                    blacklist: body.data.blacklist
                })
                writeSettings(settings)
                sendPostresponse({ status: "OK" })
            }
            break
        case "changeKey":
            {
                const settings: Settings = await getSettings()
                settings.eventKey = body.data
                writeSettings(settings)
                sendPostresponse({ status: "OK" })
            }
            break
        case "changeDayNumber":
            {
                const settings: Settings = await getSettings()
                settings.dayNumber = body.dayNumber
                writeSettings(settings)
                sendPostresponse({ status: "OK" })
            }
            break
        case "deploySchedule":
            generateSchedule(body.schedule)
            sendPostresponse({ status: "OK" })
            break;
        case "setMatch":
            setMatch(body.match)
            sendPostresponse({ status: "OK" })
            break
        case "resetAssignedMatchData":
            UserModel.resetAssignedMatchData()
            sendPostresponse({ status: "OK" })
            break
        case "startBlockEarly":
            earlyStartBlock()
            sendPostresponse({ status: "OK" })
            break;
        case "cancelStartBlockEarly":
            earlyStartBlock(true)
            sendPostresponse({ status: "OK" })
            break
        case "deleteRow":
            (await ResponseModel.findOne({ where: { id: body.rowId } }))?.destroy()
            break;
        case "deployPriorityList":
            {
                const settings = await getSettings();
                settings.teamPriority = body.priorityList;
                writeSettings(settings);
            }
            break;
    }
})

app.get('/data', async (req: AuthReq, res) => {
    const jsonData: object[] = []
        ; (await ResponseModel.findAll()).forEach((r) => jsonData.push(r.toJSON()))

    if (jsonData.length == 0) { return res.render("404", { user: req.user }) }

    const matchNumber = (await getSettings()).match;

    const numberOfResponses = {
        actual: (await ResponseModel.count({ where: { matchNum: { [Op.lte]: matchNumber } }, distinct: true, col: 'matchNum' })) * 6,
        ideal: matchNumber * 6
    }

    res.render("data", { data: { cols: Object.keys(jsonData[0]), rows: jsonData }, numberOfResponses })
})

app.get("*", async (req: AuthReq, res) => {
    res.render("404", { user: req.user })
})

    ; (async () => {
        server.listen(PORT);
        console.log(`listening on port ${PORT}! enjoy!`);
    })()

// UserModel.findAll().then(u => {
//     u.forEach((s) => {
//         s.update({ assignedMatches: [...new Set(s.assignedMatches)] })
//     })
// })