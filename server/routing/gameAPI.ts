import { GamblingQuestion, TokenLeaderboardEntry } from '@shared/schemas/game/game';
import { lootboxes, LootboxKey } from '@shared/schemas/game/lootboxes';
import express from 'express';
import { addQuestion, getQuestions } from 'server/game/gambling';
import { buyLootbox } from 'server/game/lootboxes';
import UserModel from 'server/models/users/UserModel';
import { AuthReq } from 'server/types';
import z from 'zod';

const gameAPIRouter = express.Router();

/** {@link TokenLeaderboardEntry[]} */
gameAPIRouter.get("/leaderboard/tokens", async (req, res) => {
    const users = await UserModel.findAll();
    const leaderboard: TokenLeaderboardEntry[] = users.map(u => ({
        userId: u.id,
        username: u.username,
        tokens: u.tokens,
        displayName: u.displayName
    }));
    res.send(leaderboard.sort((a, b) => b.tokens - a.tokens));
});

/** {@link GamblingQuestion[]} */
gameAPIRouter.get("/bookie/getQuestions", async (req, res) => {
    res.send(getQuestions());
});

gameAPIRouter.post("/bookie/setQuestion", async (req, res) => {
    const question = GamblingQuestion.safeParse(req.body);
    if (!question.success) { res.sendStatus(400); return; }

    addQuestion(question.data);
    res.sendStatus(200);
});

gameAPIRouter.post("/buyLootbox", async (req: AuthReq, res) => {
    const lootboxId = z.object({ box: z.string() }).safeParse(req.body).data?.box;
    if (!req.user || !lootboxId || !Object.keys(lootboxes).includes(lootboxId)) { res.sendStatus(400); return; }
    const lootbox = lootboxes[lootboxId as LootboxKey];
    const title = buyLootbox(req.user, lootbox);
    if (!title) { res.sendStatus(400); return; }
    res.send({ title });
})

export default gameAPIRouter;