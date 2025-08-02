import { DeployPayload } from '@shared/schemas/schedule';
import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { z } from 'zod';
import { CreateUser, SaveableInputData, SimpleUser } from '../../shared/schemas/API';
import UserBlockAssignmentModel from '../models/scheduling/UserBlockAssignmentModel';
import SessionModel from '../models/users/SessionModel';
import UserModel from '../models/users/UserModel';
import deploySchedules from '../scheduling/deploySchedules';
import { getSettingsValue, setSettingsValue } from '../settings';
import { SerializedForm } from '@shared/schemas/forms';
import Form from '@shared/forms/Form';
import FormModel from '../models/forms/FormModel';

const adminAPIRouter = express.Router();

/**
 * Creates getter and setter routes for a value.
 * @param getter The function to get the value and send to client. GET route sends `{"value": string}`.
 * @param setter The function to set the value using posted data. POST route expects `{"value": string}`.
 * @param valueKey The key to be used in the route listener urls. Ex: `"Ex"` -> `/api/admin/setEx` and `/api/admin/getEx`
 */
function createValueRoute(getter: () => Promise<string>, setter: (value: string) => Promise<void>, valueKey: string) {
    adminAPIRouter.post(`/set${valueKey}`, async (req: Request, res: Response) => {
        const body = SaveableInputData.safeParse(req.body); // want to use parseInt on this if T is number

        if (body.success && body.data) {
            await setter(body.data.value);
            res.sendStatus(200);
            return;
        }

        res.sendStatus(400);
    });

    adminAPIRouter.get(`/get${valueKey}`, async (req: Request, res: Response) => {
        res.send({ value: await getter() });
    });
}

createValueRoute(async () => {
    return await getSettingsValue("eventKey");
}, async (val) => {
    await setSettingsValue("eventKey", val);
}, "EventKey");

createValueRoute(async () => {
    return await getSettingsValue("slackClientId");
}, async (val) => {
    await setSettingsValue("slackClientId", val);
}, "SlackClientId");

createValueRoute(async () => {
    return await getSettingsValue("slackToken");
}, async (val) => {
    return await setSettingsValue("slackToken", val);
}, "SlackOathToken");

createValueRoute(async () => {
    return await getSettingsValue("slackClientSecret");
}, async (val) => {
    return await setSettingsValue("slackClientSecret", val);
}, "SlackClientSecret");

createValueRoute(async () => {
    return await getSettingsValue("theBlueAlliance");
}, async (val) => {
    return await setSettingsValue("theBlueAlliance", val);
}, "TbaToken");

adminAPIRouter.post("/addUser", async (req: Request, res: Response) => {
    const body = CreateUser.safeParse(req.body);
    if (body.success && body.data) {
        await UserModel.addUser(body.data.username, body.data.password, body.data.permission, body.data.reliable);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

adminAPIRouter.post("/deleteUser", async (req: Request, res: Response) => {
    const body = z.object({ id: z.number() }).safeParse(req.body);
    if (body.success && body.data) {
        const user = await UserModel.findByPk(body.data.id);
        if (user?.id == 0) {
            res.sendStatus(400);
            return;
        }
        await SessionModel.destroy({ where: { userId: body.data.id } });
        await UserBlockAssignmentModel.destroy({ where: { userId: body.data.id } });
        await user?.destroy();
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

adminAPIRouter.get("/getUsers", async (req: Request, res: Response) => {

    const users = await UserModel.findAll();
    const body = z.array(SimpleUser).safeParse(users);

    if (body.success && body.data) {
        res.json(body.data);
        return;
    }

    res.sendStatus(500);
});

adminAPIRouter.post("/editUser", async (req: Request, res: Response) => {
    const body = SimpleUser.safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    const user = await UserModel.findOne({ where: { id: body.data.id } });
    if (!user) { res.sendStatus(400); return; }

    // Replaces all values in user with corresponding values of body.data
    user.set(body.data);

    user.save();
    res.sendStatus(200);
    return;
});

adminAPIRouter.post("/setUserPassword", async (req: Request, res: Response) => {
    const body = z.object({ id: z.number(), password: z.string() }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    const user = await UserModel.findOne({ where: { id: body.data.id } });
    if (!user) { res.sendStatus(400); return; }

    await SessionModel.destroy({
        where: { userId: user.id }
    });

    bcrypt.hash(body.data.password, 12, async function (err, hash) {
        if (!err) user.update({ password: hash });
    });

    res.sendStatus(200);
});

adminAPIRouter.post("/deploySchedule", async (req: Request, res: Response) => {
    const body = DeployPayload.safeParse(req.body);

    if (body.success && body.data) {
        res.sendStatus(await deploySchedules(body.data) ? 200 : 500);
        return;
    }
    res.sendStatus(400);
});

adminAPIRouter.post("/saveForm", async (req: Request, res: Response) => {
    const body = z.object({
        form: SerializedForm,
        newForm: z.boolean()
    }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    if (body.data.newForm) {
        const current = await FormModel.getSerializedForm(body.data.form.id);
        if (current !== undefined) {
            res.status(200).send({ err: "already exists" });
            return;
        };
    }

    await FormModel.storeForm(body.data.form);
    res.sendStatus(200);
});

adminAPIRouter.post("/setDeployed", async (req: Request, res: Response) => {
    const body = z.object({
        form: z.string(),
        deployed: z.boolean()
    }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    const form = await FormModel.getSerializedForm(body.data.form);
    if (!form) { res.sendStatus(400); return; }

    form.deployed = body.data.deployed;
    await FormModel.storeForm(form);
    res.sendStatus(200);
});

adminAPIRouter.post("/deleteForm", async (req: Request, res: Response) => {
    const body = z.object({ form: z.string() }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    await FormModel.destroy({ where: { id: body.data.form } });
    res.sendStatus(200);
});

export default adminAPIRouter;