import { z } from "zod";

export const SbTeamData = z.object({
    district_points: z.number(),
    district_rank: z.number(),
    epa: z.object({
        breakdown: z.object({
            total_points: z.number(),
        })
    }),
    record: z.object({
        wins: z.number(),
        losses: z.number(),
        ties: z.number(),
        count: z.number(),
        winrate: z.number()
    })
});
export type SbTeamData = z.infer<typeof SbTeamData>;