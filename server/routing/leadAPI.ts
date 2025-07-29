import express from 'express';
import { z } from 'zod';
import assignForMatch, { currentAssignments } from '../data/assignForMatch';
import { getSettingsValue } from '../settings';

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

leadAPIrouter.get("/getCurrentMatch", async (req, res) => {
    const match = await getSettingsValue("match");
    res.send({ match });
});

leadAPIrouter.get("/getCurrentAssignment", async (req, res) => {
    res.send({ assignments: currentAssignments });
});

export default leadAPIrouter;