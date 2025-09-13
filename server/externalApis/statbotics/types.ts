import { z } from "zod";

export const SbTeamData = z.object({
    district_points: z.number(),
    district_rank: z.number(),
    epa: z.object({
        breakdown: z.object({
            total_points: z.number(),
        })
    })
});
export type SbTeamData = z.infer<typeof SbTeamData>;