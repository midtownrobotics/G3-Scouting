import express from 'express';
import { TokenLeaderboardEntry } from '@shared/schemas/game';
import UserModel from 'server/models/users/UserModel';

const gameAPIRouter = express.Router();

/** {@link TokenLeaderboardEntry[]} */
gameAPIRouter.get("/leaderboard/tokens", async (req, res) => {
    const users = await UserModel.findAll();
    const leaderboard: TokenLeaderboardEntry[] = users.map(u => ({
        userId: u.id,
        username: u.username,
        tokens: u.tokens
    }));
    res.send(leaderboard.sort((a,b) => b.tokens - a.tokens));
});

export default gameAPIRouter;