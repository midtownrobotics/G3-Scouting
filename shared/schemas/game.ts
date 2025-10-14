import { z } from 'zod';

export const TokenLeaderboardEntry = z.object({
    username: z.string(),
    displayName: z.string().nullish(),
    userId: z.number(),
    tokens: z.number()
});
export type TokenLeaderboardEntry = z.infer<typeof TokenLeaderboardEntry>;