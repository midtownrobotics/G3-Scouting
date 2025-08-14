import { UserInformation } from "@shared/schemas/user";
import express from 'express';
import UserModel from "../models/users/UserModel";
import { AuthReq } from "../types";
import { getSettingsValue } from "../settings";
import AssignmentModel from "../models/scheduling/AssignmentModel";
import UserBlockAssignmentModel from "../models/scheduling/UserBlockAssignmentModel";
import BlockModel from "../models/scheduling/BlockModel";

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
        },
        currentAssignment: await user.getCurrentAssignment()
    };

    res.send(data);
});

genericAPIRouter.get("/schedules", async (req, res) => {
    const schedules = [];
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

export default genericAPIRouter;