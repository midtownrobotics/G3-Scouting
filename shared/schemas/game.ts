import { Rarity } from '@shared/utils';
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
    correctResponse: z.number().optional()
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

export const LockQuestion = z.object({
    match: z.number(),
    locked: z.boolean()
})
export type LockQuestion = z.infer<typeof LockQuestion>;

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
        amount: z.number(),
        tokens: z.number()
    })
})).or(z.object({
    type: z.literal("updateQuestion"),
    payload: GamblingQuestion
})).or(z.object({
    type: z.literal("ping")
}));
export type ServerToClientMessage = z.infer<typeof ServerToClientMessage>;

export const Item = z.object({
    id: z.number(),
    name: z.string(),
    rarity: z.nativeEnum(Rarity),
})

export type Item = z.infer<typeof Item>;

export const InventoryItem = z.object({
    itemId: z.number(),
    equipped: z.boolean().default(false)
})
export type InventoryItem = z.infer<typeof InventoryItem>;

export const UserInventory = z.object({
    userId: z.number(),
    items: z.array(InventoryItem),
})
export type UserInventory = z.infer<typeof UserInventory>;

export const Lootbox = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    rarityChances: z.record(
        z.nativeEnum(Rarity),
        z.number().min(0).max(1)
    ),
}).refine(
    lb => 
        Math.abs(
            Object.values(lb.rarityChances).reduce((a, b) => a + b, 0) - 1
        ) < 1e-6,
        { message: "Lootbox rarity chances must sum to 1"}
);

export type Lootbox = z.infer<typeof Lootbox>;