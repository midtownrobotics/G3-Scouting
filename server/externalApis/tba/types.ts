import { z } from "zod";

const Alliance = z.object({
    dq_team_keys: z.array(z.string()).nullish(),
    score: z.number().nullish(),
    surrogate_team_keys: z.array(z.string()).nullish(),
    team_keys: z.array(z.string())
})

export const TbaMatchData = z.object({
    comp_level: z.enum(["qm", "qf", "sf", "f"]),
    time: z.number().nullish(),
    actual_time: z.number().nullish(),
    post_result_time: z.number().nullish(),
    predicted_time: z.number().nullish(),
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
    }).nullish(),
    winning_alliance: z.enum(["red", "blue", ""]).nullish()
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

export const TbaTeamSimpleData = z.object({
    key: z.string(),
    team_number: z.number(),
    nickname: z.string(),
    name: z.string(),
    city: z.string(),
    state_prov: z.string(),
    country: z.string()
}).passthrough()
export type TbaTeamSimpleData = z.infer<typeof TbaTeamSimpleData>;