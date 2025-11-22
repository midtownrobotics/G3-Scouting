import express from 'express';
import { z } from 'zod';
import assignForMatch, { getAllCurrentAssignmentStatuses } from '../data/assignForMatch';
import { sendNotification } from 'server/other/notifications';

const leadAPIrouter = express.Router();

leadAPIrouter.post("/assignForMatch", async (req, res) => {
    const body = z.object({ match: z.number() }).safeParse(req.body);
    if (body.success) {
        await assignForMatch(body.data.match);
        res.send(200);
        return;
    }
    res.send(400);
});

leadAPIrouter.get("/getCurrentAssignment", async (req, res) => {
    res.send({ assignments: await getAllCurrentAssignmentStatuses() });
});

leadAPIrouter.post("/sendNotification", async (req, res) => {
    const body = z.object({ msg: z.string(), expires: z.number() }).safeParse(req.body);
    console.log(req.body)
    if (body.success) {
        sendNotification(body.data.msg, "userMessaging", new Date(body.data.expires), 1);
        res.send(200);
        return;
    }
    res.send(400);
})

export default leadAPIrouter;