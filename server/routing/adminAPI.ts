import express, { Request, Response } from 'express';
import { PermissionSchema, SimpleUser, SimpleUserSchema } from '../../shared/schemas/API'
import { getSettings, writeSettings } from '../storage';
import UserModel from '../models/users/UserModel';
import { isValidUser } from '../models/users/userModelUtils';
import { z } from 'zod';
import { Schedule } from '../types';
const adminAPIRouter = express.Router();

adminAPIRouter.post("/addUser", async (req: Request, res: Response) => {
    const body = SimpleUserSchema.safeParse(req.body);

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
    const body = z.object({id: z.number()}).safeParse(req.body)
    if (body.success && body.data) {
        await (await UserModel.findOne({ where: { id: body.data.id } }))?.destroy();
        res.sendStatus(200)
        return
    }
    res.sendStatus(400)
});

adminAPIRouter.get("/getUsers", async (req: Request, res: Response) => {

    const users = await UserModel.findAll()
    const body = z.array(SimpleUserSchema).safeParse(users);

    if (body.success && body.data) {
        res.json(body.data);
        return;
    }

    res.sendStatus(500)
});

adminAPIRouter.post("/editUser", async (req: Request, res: Response) => {

    const body = SimpleUserSchema.safeParse(req.body);
    const data = body.data;
    if (!body.success || !data) {
        res.sendStatus(400);
        return;
    }

    const user = await UserModel.findOne({ where: { id: data.id } });
    if (!user) {
        res.sendStatus(400);
        return;
    }

    // Replaces all values in user with corresponding values of body.data
    user.set(body.data);

    if (await isValidUser(user)) {
        user.save();
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

adminAPIRouter.post("/addPerm", async (req: Request, res: Response) => {
    const body = PermissionSchema.safeParse(req.body)

    if (body.success && body.data) {
        const settings = await getSettings();
        if (settings.permissionLevels.some(p => p.name == body.data.name)) {
            res.sendStatus(400)
            return
        }
        settings.permissionLevels.push({ ...body.data, id: Math.max(...settings.permissionLevels.map(p => p.id)) + 1})
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
    const body = z.object({id: z.number()}).safeParse(req.body)

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

adminAPIRouter.post("/changeKey", async (req: Request, res: Response) => {
    const body = z.string().safeParse(req.body);

    if (body.success && body.data) {
        const settings = await getSettings();
        settings.eventKey = body.data;
        writeSettings(settings);
        res.sendStatus(200);
        return
    }
    res.sendStatus(400)
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

adminAPIRouter.post("/deploySchedule", async (req: Request, res: Response) => {
    let body = req.body as Schedule;
    // TODO schedule?????
})

export default adminAPIRouter;