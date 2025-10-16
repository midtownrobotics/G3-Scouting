import express from 'express';
import { GamblingQuestion, TokenLeaderboardEntry } from '@shared/schemas/game';
import UserModel from 'server/models/users/UserModel';
import { addQuestion, getCurrentQuestion, getQuestion, getQuestions } from 'server/game/gambling';
import { getSettingsValue } from 'server/settings';

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

/** {@link GamblingQuestion} */
gameAPIRouter.get("/getCurrentQuestion", async (req, res) => {
    res.send(await getCurrentQuestion());
});

gameAPIRouter.post("/setQuestion", async (req, res) => {
    const question = GamblingQuestion.safeParse(req.body);
    if (!question.success) { res.send(400); return; }

    addQuestion(question.data);
    res.send(200);
});

export default gameAPIRouter;