import { UserScheduleData } from "@shared/schemas/schedule";
import { UserInformation, UserProfile } from "@shared/schemas/user";
import express from 'express';
import AssignmentModel from "../models/scheduling/AssignmentModel";
import BlockModel from "../models/scheduling/BlockModel";
import UserModel from "../models/users/UserModel";
import { getSettingsValue } from "../other/settings";
import { AuthReq } from "../types";
import { getNotifications } from "server/other/notifications";
import { z } from "zod";
import { parse } from "papaparse";

const genericAPIRouter = express.Router();

genericAPIRouter.get("/status", (req, res) => {
    res.send("ok");
});

genericAPIRouter.get("/nameFromId/:userId", async (req, res) => {
    const user = await UserModel.findByPk(req.params.userId);
    if (!user) { res.send(400); return; }
    res.send({ name: user.username });
});

genericAPIRouter.get("/getCurrentMatch", async (req, res) => {
    const match = await getSettingsValue("match");
    res.send(match);
});

genericAPIRouter.get("/me", async (req: AuthReq, res) => {
    const user = await UserModel.findByPk(req.user?.id);

    if (!user) {
        res.sendStatus(500);
        return;
    }

    const data: UserInformation = {
        user: {
            id: user.id,
            username: user.username,
            permission: user.permission,
            redAlliance: user.redAlliance,
            reliable: user.reliable,
            schedule: user.schedule,
            nextMatch: user.nextMatch,
            slackLinked: user.slackLinked,
            displayName: user.displayName,
            tokens: user.tokens,
            xp: user.xp
        },
        currentAssignment: await user.getCurrentAssignment(),
        notifications: getNotifications(user.id)
    };

    res.send(data);
});

genericAPIRouter.get("/schedules", async (req, res) => {
    const schedules: UserScheduleData[] = [];
    for (const user of (await UserModel.findAll())) {
        schedules.push({
            schedule: user.schedule,
            id: user.id,
            name: user.username,
            current: await user.getCurrentAssignment()
        })
    }
    res.send(schedules);
})

genericAPIRouter.get("/assignments", async (req, res) => {
    res.send(await AssignmentModel.findAll())
})

genericAPIRouter.get("/blocks", async (req, res) => {
    res.send(await BlockModel.findAll())
})

genericAPIRouter.get("/profiles", async (req, res) => {
    const users = await UserModel.findAll();
    const parsed = await z.array(UserProfile).safeParseAsync(users);
    if (parsed.success) { res.send(parsed.data); return; }
    res.sendStatus(400);
});

export default genericAPIRouter;