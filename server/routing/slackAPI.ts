import { SITE_URL } from '@shared/config';
import express from 'express';
import { createLinkCode, getUserSlackData, linkWithCmd } from '../slack/slackLink';
import { AuthReq } from '../types';

const slackAPIRouter = express.Router();

slackAPIRouter.get("/getSlackInfo", async (req: AuthReq, res) => {
    const slackData = await getUserSlackData(req.user)
    if (!slackData) { res.sendStatus(400); return; }
    res.send(slackData);
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