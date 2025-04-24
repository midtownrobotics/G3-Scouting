import ejs from 'ejs';
import express, { Request } from 'express';
import http from 'http';
import path from 'path';
import TheBlueAllianceV3, { APICalls } from 'thebluealliancev3';
import { WebSocketServer } from 'ws';
import { generateSchedule, setMatch } from './assigner';
import { earlyStartBlock, getCurrentScoutingBlock, SCOUTING_BLOCKS } from './blockManager';
import syncDatabase from './models/syncDatabase';
import UserModel from './models/UserModel';
import startReminderSchedule from './reminders';
import slackRouter from './slack';
import { getSettings, getSettingsSync, writeSettings } from './storage';
import { AdminPostRequest, Assignment, GeneralPostRequest, Settings, UserGetData } from './types';
import generateForms from './forms/generateForms';
import { FormRegistry } from './forms/formUtils';

export const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let PORT: number = 9955;

export const TBA = new TheBlueAllianceV3(getSettingsSync().keys.theBlueAlliance);

interface AuthReq extends Request {
    user?: UserModel
}

generateForms()
syncDatabase().then(() => {
    startReminderSchedule()
    server.listen(PORT);
    console.log(`listening on port ${PORT}! enjoy!`);
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

    const settings = (await getSettings());
    const currentMatch = settings.match

    const formQuery = req.query.form?.toString()
    const forms = FormRegistry.getAll()
    const form = forms.find((f) => f.id == formQuery)

    const currentBlock = await getCurrentScoutingBlock()

    const assignment = user.assignments?.find((a) => a.time == currentBlock);

    if (form) {
        if (user.lastMatchScouted == currentMatch) {
            return res.render('form-waiting', { user: req.user })
        }
        if (form.enforceSchedule && ((assignment?.status || "break") == "break")) {
            return res.render('form-home', { forms: forms, message: "You're not currently assigned to be scouting!" })
        }

        const match = (await TBA.get({call: APICalls.event.matches.simple, event_key: settings.eventKey})).find(m => m.match_number == user.nextMatch?.number)
        return res.render('form', { data: form.generateHTML(match, user.nextMatch?.team) });
    }
    if (forms.length > 0) {
        return res.render('form-home', { forms: forms, message: false })
    }
    return res.render('form-home', { forms: forms, message: "No forms were found! Contact your server administrator if you think this is an issue." })
})

app.get('/admin', async (req, res) => {
    const settings = await getSettings()
    const allUsers = await UserModel.findAll()
    // TODO:
    // const currentResponses = await ResponseModel.findAll({ where: { matchNum: settings.match } })
    // const lastResponses = await ResponseModel.findAll({ where: { matchNum: settings.match - 1 } })
    // const currentEvilScouts = allUsers.filter((s) => s.assignedMatches.includes(settings.match) && !currentResponses.some((m) => m.scoutId == s.id))
    // const lastEvilScouts = allUsers.filter((s) => s.assignedMatches.includes(settings.match - 1) && !lastResponses.some((m) => m.scoutId == s.id))

    const html = await ejs.renderFile(path.join(__dirname, '/../views/admin.ejs'), {
        users: allUsers,
        matchReview: {
            current: {
                responses: [],
                evilScouts: [],
                number: settings.match
            },
            last: {
                responses: [],
                evilScouts: [],
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
            if (!req.user || !body.data || !body.form) {
                sendPostresponse({ status: 'ERROR' })
                break;
            }
            FormRegistry.getAll().find(f => f.id == body.form)?.submitResponse(req.user, body.data);
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
            // TODO :
            // (await ResponseModel.findOne({ where: { id: body.rowId } }))?.destroy()
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
    const formQuery = req.query.form
    const forms = Form.getForms()
    const form = forms.find((f) => f.id == formQuery)

    if (!form) {
        return res.render('data-home', { forms: forms });
    }

    const jsonData: object[] = [];

    ; (await form.getModel().findAll()).forEach((r) => jsonData.push(r.toJSON()))

    if (jsonData.length == 0) {
        return res.render('data-home', { forms: forms });
    }

    const col = req.query.col?.toString()
    const reverse = req.query.reverse?.toString()

    if (col && reverse) {
        jsonData.sort((a, b) => {
            if (!(col in a) || !(col in b)) return 0;

            const valA = a[col as keyof typeof a];
            const valB = b[col as keyof typeof b];

            if (valA < valB) return reverse === "true" ? 1 : -1
            if (valA > valB) return reverse === "true" ? -1 : 1
            return 0
        })
    }

    // if (form.options?.respondRate) {
    //     const matchNumber = (await getSettings()).match;

    //     let submitted = 0;

    //     const users = await UserModel.findAll();
    //     for (const u of users) {
    //         submitted += (await u.calculateReliability()).submitted;
    //     }

    //     return res.render("data", {
    //         data: {
    //             cols: Object.keys(jsonData[0]),
    //             rows: jsonData
    //         },
    //         numberOfResponses: {
    //             submitted,
    //             assigned: matchNumber * form.options.responsesPerMatch
    //         }
    //     })
    // }

    return res.render("data", {
        data: {
            cols: Object.keys(jsonData[0]),
            rows: jsonData
        }
    })
})

app.get('/data/event', async (req: AuthReq, res) => {

})

app.get("*", async (req: AuthReq, res) => {
    res.render("404", { user: req.user })
})