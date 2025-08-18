import { z } from "zod";

const Alliance = z.object({
    dq_team_keys: z.array(z.string()),
    score: z.number(),
    surrogate_team_keys: z.array(z.string()),
    team_keys: z.array(z.string())
})

export const TbaMatchData = z.object({
    comp_level: z.enum(["qm", "qf", "sf", "f"]),
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
    winning_alliance: z.enum(["red", "blue", ""])
}).passthrough()
export type TbaMatchData = z.infer<typeof TbaMatchData>;

export const TbaTeamEventData = z.object({
    qual: z.object({
        ranking: z.object({
            matches_played: z.number(),
            rank: z.number(),
            record: z.object({
                losses: z.number(),
                wins: z.number(),
                ties: z.number()
            })
        })
    })
}).passthrough()
export type TbaTeamEventData = z.infer<typeof TbaTeamEventData>;

export const TbaRankingData = z.object({
    rankings: z.array(z.object({
        team_key: z.string(),
        extra_stats: z.tuple([z.number()])
    }))
}).passthrough()
export type TbaRankingData = z.infer<typeof TbaRankingData>;