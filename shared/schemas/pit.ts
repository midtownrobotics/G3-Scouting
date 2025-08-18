import { z } from "zod";

export const RankingRow = z.object({
    rank: z.number(),
    wins: z.number(),
    losses: z.number(),
    ties: z.number(),
    rp: z.number(),
    epa: z.number(),
});
export type RankingRow = z.infer<typeof RankingRow>;

export const ScheduledMatch = z.object({
    key: z.string(),
    number: z.number(),
    red: z.array(z.number()),
    blue: z.array(z.number()),
});
export type ScheduledMatch = z.infer<typeof ScheduledMatch>;

export const PitMonitorData = z.object({
    team: z.number(),
    pitNow: z.array(z.string()),
    ranking: RankingRow,
    upcoming: z.array(ScheduledMatch),
});
export type PitMonitorData = z.infer<typeof PitMonitorData>;