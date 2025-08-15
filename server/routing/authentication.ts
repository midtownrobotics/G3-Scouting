import { PRODUCTION } from "@shared/config";
import { getDisallowedApis } from "@shared/permissions";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { z } from "zod";
import SessionModel from "../models/users/SessionModel";
import UserModel from "../models/users/UserModel";
import { AuthReq } from "../types";

const destroyOldSessions = async () => await SessionModel.destroy({ where: { expiresAt: { [Op.lt]: Date.now() } } });
setInterval(destroyOldSessions, 60 * 60 * 1000);
setTimeout(destroyOldSessions, 10 * 1000);

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

/** Urls to not run auth on. Exclude `"/api"` */
const ignoreUrls: string[] = ["/slack/cmdLink"];

export async function authHandler(req: AuthReq, res: Response, next: NextFunction) {
    if (ignoreUrls.includes(req.url)) return next();

    const userId = (await SessionModel.findByPk(req.cookies?.sessionToken))?.userId;
    if (!userId) { res.sendStatus(401); return; }

    const user = await UserModel.findByPk(userId);
    if (!user) { res.sendStatus(401); return; }

    const url: string = req.url.replace(/\/$/, '');

    if (url == "api/status") {
        req.user = user;
        return next();
    }

    const blacklist = getDisallowedApis(user.permission);
    if (blacklist.some(path => url.includes(path))) {
        res.sendStatus(403);
        return;
    }

    req.user = user;
    next();
}

export async function loginHandler(req: Request, res: Response) {
    const body = z.object({
        username: z.string(),
        password: z.string()
    }).safeParse(req.body);

    if (body.data && body.success) {
        const user = await UserModel.findOne({
            where: { username: body.data.username }
        });

        if (!user || !await bcrypt.compare(body.data.password, user.password)) {
            res.sendStatus(401);
            return;
        }

        const sessionToken = crypto.randomUUID();
        const expiresAt = Date.now() + SESSION_DURATION_MS;
        await SessionModel.create({ userId: user.id, token: sessionToken, expiresAt });

        res.cookie("sessionToken", sessionToken, {
            httpOnly: true,
            secure: PRODUCTION,
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000,
        });

        res.sendStatus(200);
        return;
    }

    res.sendStatus(401);
}