import { z } from "zod";

const Alliance = z.object({
    dq_team_keys: z.array(z.string()),
    score: z.number(),
    surrogate_team_keys: z.array(z.string()),
    team_keys: z.array(z.string())
})

export const TbaMatchData = z.object({
    time: z.number(),
    actual_time: z.number(),
    post_result_time: z.number(),
    predicted_time: z.number(),
    event_key: z.string(),
    key: z.string(),
    match_number: z.number(),
    alliances: z.object({
        blue: Alliance,
        red: Alliance
    }),
    score_breakdown: z.object({
        red: z.unknown(),
        blue: z.unknown()
    }),
    winning_alliance: z.enum(["red", "blue"])
}).passthrough()
export type TbaMatchData = z.infer<typeof TbaMatchData>;