import bcrypt from 'bcrypt';
import express from 'express';
import { z } from "zod";
import SessionModel from "../models/users/SessionModel";
import { AuthReq } from '../types';

const userSettingsAPIRouter = express.Router();

userSettingsAPIRouter.post("/resetPassword", async (req: AuthReq, res) => {
    const body = z.object({ password: z.string() }).safeParse(req.body);
    if (!body.success || !body.data) { res.sendStatus(400); return; }

    await SessionModel.destroy({
        where: { userId: req.user?.id }
    });

    bcrypt.hash(body.data.password, 12, async function(err, hash) {
        if (!err) req.user?.update({ password: hash });
    });

    res.sendStatus(200);
});

userSettingsAPIRouter.post("/logout", async (req, res) => {
    (await SessionModel.findByPk(req.cookies?.sessionToken))?.destroy()
    res.sendStatus(200)
})

userSettingsAPIRouter.post("/sessionClear", async (req: AuthReq, res) => {
    await SessionModel.destroy({ where: { userId: req.user?.id } })
    res.sendStatus(200)
})

export default userSettingsAPIRouter;