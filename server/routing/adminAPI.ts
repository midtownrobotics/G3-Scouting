import { DeployPayload } from '@shared/schemas/schedule';
import express, { Request, Response } from 'express';
import { z } from 'zod';
import { CreateUser, Permission, SaveableInputData, SimpleUser } from '../../shared/schemas/API';
import UserModel from '../models/users/UserModel';
import { isValidUser } from '../models/users/userModelUtils';
import deploySchedules from '../scheduling/deploySchedules';
import { getSettings, writeSettings } from '../storage';
import SessionModel from '../models/users/SessionModel';
import bcrypt from 'bcrypt';

const adminAPIRouter = express.Router();

/**
 * Creates getter and setter routes for a value.
 * @param getter The function to get the value and send to client. GET route sends `{"value": string}`.
 * @param setter The function to set the value using posted data. POST route expects `{"value": string}`.
 * @param valueKey The key to be used in the route listener urls. Ex: `"Key"` -> `/api/admin/setKey` and `/api/admin/getKey`
 */
function createValueRoute(getter: () => Promise<string>, setter: (value: string) => Promise<void>, valueKey: string) {
    adminAPIRouter.post(`/set${valueKey}`, async (req: Request, res: Response) => {
        const body = SaveableInputData.safeParse(req.body); // want to use parseInt on this if T is number

        if (body.success && body.data) {
            await setter(body.data.value)
            res.sendStatus(200);
            return
        }

        res.sendStatus(400)
    });

    adminAPIRouter.get(`/get${valueKey}`, async (req: Request, res: Response) => {
        res.send({ value: await getter() })
    });
}

createValueRoute(async () => {
    return (await getSettings()).eventKey
}, async (val) => {
    const settings = await getSettings();
    settings.eventKey = val;
    writeSettings(settings)
}, "EventKey")

createValueRoute(async () => {
    return (await getSettings()).keys.slack.clientId
}, async (val) => {
    const settings = await getSettings();
    settings.keys.slack.clientId = val;
    writeSettings(settings)
}, "SlackClientId")

createValueRoute(async () => {
    return (await getSettings()).keys.slack.token
}, async (val) => {
    const settings = await getSettings();
    settings.keys.slack.token = val;
    writeSettings(settings)
}, "SlackOathToken")

createValueRoute(async () => {
    return (await getSettings()).keys.slack.clientSecret
}, async (val) => {
    const settings = await getSettings();
    settings.keys.slack.clientSecret = val;
    writeSettings(settings)
}, "SlackClientSecret")

createValueRoute(async () => {
    return (await getSettings()).keys.theBlueAlliance
}, async (val) => {
    const settings = await getSettings();
    settings.keys.theBlueAlliance = val;
    writeSettings(settings)
}, "TbaToken")

createValueRoute(async () => {
    return (await getSettings()).dayNumber.toString()
}, async (val) => {
    const intVal = parseInt(val)
    if (Number.isNaN(intVal)) return;
    const settings = await getSettings();
    settings.dayNumber = intVal
    writeSettings(settings)
}, "DayNumber")

adminAPIRouter.post("/addUser", async (req: Request, res: Response) => {
    const body = CreateUser.safeParse(req.body);

    if (body.success && body.data) {
        const settings = await getSettings()

        if (await isValidUser(body.data)) {
            UserModel.addUser(body.data.username, body.data.password, body.data.permissionId, body.data.reliable);
            res.sendStatus(200);
            return;
        }
    }

    res.sendStatus(400);
});

adminAPIRouter.post("/deleteUser", async (req: Request, res: Response) => {
    const body = z.object({ id: z.number() }).safeParse(req.body)
    if (body.success && body.data) {
        const user = await UserModel.findOne({ where: { id: body.data.id } })
        if (user?.id == 0) {
            res.sendStatus(400);
            return;
        }
        user?.destroy()
        res.sendStatus(200)
        return
    }
    res.sendStatus(400)
});

adminAPIRouter.get("/getUsers", async (req: Request, res: Response) => {

    const users = await UserModel.findAll()
    const body = z.array(SimpleUser).safeParse(users);

    if (body.success && body.data) {
        res.json(body.data);
        return;
    }

    res.sendStatus(500)
});

adminAPIRouter.post("/editUser", async (req: Request, res: Response) => {
    const body = SimpleUser.safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    const user = await UserModel.findOne({ where: { id: body.data.id } });
    if (!user) { res.sendStatus(400); return; }

    // Replaces all values in user with corresponding values of body.data
    user.set(body.data);

    if (await isValidUser(user)) {
        user.save();
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

adminAPIRouter.post("/setUserPassword", async (req: Request, res: Response) => {
    const body = z.object({ id: z.number(), password: z.string() }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    const user = await UserModel.findOne({ where: { id: body.data.id } });
    if (!user) { res.sendStatus(400); return; }

    await SessionModel.destroy({
        where: { userId: user.id }
    });

    bcrypt.hash(body.data.password, 12, async function(err, hash) {
        if (!err) user.update({ password: hash });
    });

    res.sendStatus(200);
});

adminAPIRouter.post("/addPerm", async (req: Request, res: Response) => {
    const body = Permission.safeParse(req.body)

    if (body.success && body.data) {
        const settings = await getSettings();
        if (settings.permissionLevels.some(p => p.name == body.data.name)) {
            res.sendStatus(400)
            return
        }
        settings.permissionLevels.push({ ...body.data, id: Math.max(...settings.permissionLevels.map(p => p.id)) + 1 })
        writeSettings(settings);
        res.sendStatus(200);
        return
    }
    res.sendStatus(400);
});

adminAPIRouter.get("/getPerms", async (req: Request, res: Response) => {
    res.json((await getSettings()).permissionLevels);
    return;
});

adminAPIRouter.post("/deletePerm", async (req: Request, res: Response) => {
    const body = z.object({ id: z.number() }).safeParse(req.body)

    if (body.success && body.data) {
        const settings = await getSettings();
        const i = settings.permissionLevels.findIndex((p) => p.id == body.data.id)
        if (settings.permissionLevels[i].name == "admin") {
            res.sendStatus(400)
            return
        }
        settings.permissionLevels.splice(i, 1)
        writeSettings(settings);
        res.sendStatus(200);
        return
    }
    res.sendStatus(400);
});

adminAPIRouter.post("/changeDay", async (req: Request, res: Response) => {
    const body = z.number().safeParse(req.body);

    if (body.success && body.data) {
        let settings = await getSettings();
        settings.dayNumber = body.data;
        writeSettings(settings);
        res.sendStatus(200);
        return
    }
    res.sendStatus(400)
});

// Note: This will remove all AssignmentModel and BlockModel routes.
adminAPIRouter.post("/deploySchedule", async (req: Request, res: Response) => {
    const body = DeployPayload.safeParse(req.body);

    if (body.success && body.data) {
        res.sendStatus(await deploySchedules(body.data) ? 200 : 500)
        return;
    }
    res.sendStatus(400)
})

export default adminAPIRouter;