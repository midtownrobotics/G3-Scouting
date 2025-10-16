import { z } from 'zod';

export const TokenLeaderboardEntry = z.object({
    username: z.string(),
    displayName: z.string().nullish(),
    userId: z.number(),
    tokens: z.number()
});
export type TokenLeaderboardEntry = z.infer<typeof TokenLeaderboardEntry>;

export const GamblingQuestion = z.object({
    match: z.number(),
    question: z.string(),
    responses: z.array(z.string()),
    locked: z.boolean(),
    correctResponse: z.string().optional()
})
export type GamblingQuestion = z.infer<typeof GamblingQuestion>;

export const Bet = z.object({
    match: z.number(),
    responseIndex: z.number(),
    amount: z.number()
})
export type Bet = z.infer<typeof Bet>;

export const ResponseBetData = z.object({
    responseIndex: z.number(),
    response: z.string(),
    count: z.number(),
    percent: z.number(),
    totalBet: z.number()
})
export type ResponseBetData = z.infer<typeof ResponseBetData>;

export const ClientToServerMessage = z.object({
    type: z.literal("placeBet"),
    payload: z.object({
        match: z.number(),
        responseIndex: z.number(),
        amount: z.number(),
    }),
}).or(z.object({
    type: z.literal("dropBet"),
    payload: z.object({
        match: z.number(),
    }),
}));
export type ClientToServerMessage = z.infer<typeof ClientToServerMessage>;

export const ServerToClientMessage = z.object({
    type: z.literal("betData"),
    payload: z.array(ResponseBetData)
}).or(z.object({
    type: z.literal("userResponse"),
    payload: z.object({
        userId: z.number(),
        responseIndex: z.number(),
        amount: z.number()
    })
})).or(z.object({
    type: z.literal("updateQuestion"),
    payload: GamblingQuestion
})).or(z.object({
    type: z.literal("ping")
}));;
export type ServerToClientMessage = z.infer<typeof ServerToClientMessage>;