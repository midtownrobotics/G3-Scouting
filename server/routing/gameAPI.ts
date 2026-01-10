import { GamblingQuestion, Item, Lootbox, TokenLeaderboardEntry } from '@shared/schemas/game';
import express from 'express';
import { ListNested } from 'react-bootstrap-icons';
import { addQuestion, getQuestions } from 'server/game/gambling';
import { openLootBox } from 'server/game/lootboxes';
import LootboxModel from 'server/models/items/LootboxModel';
import UserModel from 'server/models/users/UserModel';
import { AuthReq } from 'server/types';

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
    if (!question.success) { res.send(400); return; }

    addQuestion(question.data);
    res.send(200);
});

gameAPIRouter.get("/lootboxes/getLootBoxData", async (req, res) => {
    const lootBoxes = await LootboxModel.findAll();

    const payload: Lootbox[] = lootBoxes.map(lb => Lootbox.parse(lb.toJSON()));

    res.json(payload);
});

gameAPIRouter.get("/lootboxes/openLootbox/:lootboxId", async (req: AuthReq, res) => {
    const item = await openLootBox(req.user, Number(req.params.lootboxId));

    res.json(Item.parse(item.toJSON()));
});

export default gameAPIRouter;