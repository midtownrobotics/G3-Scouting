import { GamblingQuestion, TokenLeaderboardEntry } from '@shared/schemas/game';
import express from 'express';
import { addQuestion, getQuestions } from 'server/game/gambling';
import UserModel from 'server/models/users/UserModel';

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
gameAPIRouter.get("/getQuestions", async (req, res) => {
    res.send(getQuestions());
});

gameAPIRouter.post("/setQuestion", async (req, res) => {
    const question = GamblingQuestion.safeParse(req.body);
    if (!question.success) { res.send(400); return; }

    addQuestion(question.data);
    res.send(200);
});

export default gameAPIRouter;