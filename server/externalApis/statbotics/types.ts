import { z } from "zod";
import * as sharedStatboticsTypes from "@shared/schemas/apis/statbotics";

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
}).passthrough();
export type SbTeamData = z.infer<typeof SbTeamData>;

export const SbMatchData = sharedStatboticsTypes.SbMatchData;
export type SbMatchData = sharedStatboticsTypes.SbMatchData;