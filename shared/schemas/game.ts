import { z } from 'zod';

export const TokenLeaderboardEntry = z.object({
    username: z.string(),
    userId: z.number(),
    tokens: z.number()
});
export type TokenLeaderboardEntry = z.infer<typeof TokenLeaderboardEntry>;