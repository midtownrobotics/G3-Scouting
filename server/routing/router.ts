import express from 'express';
import http from 'http';
import path from 'path';
import { PRODUCTION } from '../../shared/constants';
import adminAPIRouter from './adminAPI';
import authHandler from './authHandler';
import formAPIRouter from './formsAPI';
import { AuthReq } from '../types';
import { SimpleUser, UserInformation } from '@shared/schemas/API';
import { Assignment, SendableSchedule, UserAssignment } from '@shared/schemas/schedule';
import UserModel from '../models/users/UserModel';
import UserBlockAssignmentModel from '../models/scheduling/UserBlockAssignmentModel';
import AssignmentModel from '../models/scheduling/AssignmentModel';

const app = express();
export const server = http.createServer(app);

app.use(express.json());

if (PRODUCTION) app.use(express.static(path.join(__dirname + "../../../client/dist")));

app.get("/api/status", (req, res) => {
    res.send("ok")
})

// Unproteced API routes ⬆⬆⬆⬆⬆
app.use("/api", authHandler);
// Protected API routes  ⬇⬇⬇⬇⬇

app.use("/api/admin", adminAPIRouter)
app.use("/api/forms", formAPIRouter)

app.get("/api/me", async (req: AuthReq, res) => {

    const user = await UserModel.findByPk(req.user?.id, {
        include: [UserBlockAssignmentModel],
    });

    if (!user) {
        res.sendStatus(500);
        return;
    }

    const data: UserInformation = {
        user: user.toJSON(),
        currentAssignment: await user.getCurrentAssignment()
    }

    res.send(data)
})

app.get("/api/assignments", async (req, res) => {
    const data: Assignment[] = await AssignmentModel.findAll()
    res.send(data)
})