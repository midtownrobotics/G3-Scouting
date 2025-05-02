import { NextFunction, Response } from "express";
import UserModel from "../models/users/UserModel";
import { getSettings, writeSettings } from "../storage";
import { AuthReq, Settings } from "../types";
import { getUserFromAuth } from "../models/users/userModelUtils";

async function authHandler(req: AuthReq, res: Response, next: NextFunction) {

    const allUsers = await UserModel.findAll()

    if (!allUsers[0] || !allUsers.find((user) => user.permissionId == 0)) {
        UserModel.addUser("admin", "password", 0, true)
    }

    const settings: Settings = await getSettings();

    if (!settings.permissionLevels.find(p => p.name = "admin")) {
        settings.permissionLevels.push({ name: "admin", blacklist: [], id: 0 })
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
}

export default authHandler;