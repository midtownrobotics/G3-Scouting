import express from 'express';
import { z } from 'zod';
import { AuthReq } from '../types';
import { createLinkCode, linkWithCmd } from '../slack/slackLink';
import { SITE_URL } from '@shared/config';
import { getSettingsValue } from '../settings';

const slackAPIRouter = express.Router();

slackAPIRouter.get("/getSlackInfo", async (req: AuthReq, res) => {
    const userId = req.user?.slackId;
    if (!userId) { res.sendStatus(400); return; }

    const token = await getSettingsValue("slackToken");

    const slackRes = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await slackRes.json();
    res.send(data.user);
});

slackAPIRouter.get("/getLinkCode", async (req: AuthReq, res) => {
    if (!req.user) { res.sendStatus(400); return; }
    res.send({ code: createLinkCode(req.user?.id) });
});

slackAPIRouter.post("/cmdLink", async (req, res) => {
    if (!req.body.text || !req.body.user_id) { res.send("No token sent."); return; }
    if (!await linkWithCmd(req.body.text, req.body.user_id)) { res.send("Invalid token."); return; }

    res.send({
        type: "mrkdwn",
        text: `Account linked successfully, you can now <${SITE_URL}/?page=settings&linkAttempt|return to the settings page>.`
    });
});

export default slackAPIRouter;