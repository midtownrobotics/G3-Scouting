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
}).passthrough();
export type SbTeamData = z.infer<typeof SbTeamData>;

export const SbMatchData = z.object({
  key: z.string(),
  year: z.number(),
  event: z.string(),
  comp_level: z.string(),
  match_number: z.number(),
  time: z.number().optional(),
  predicted_time: z.number().optional(),
  alliances: z.object({
    red: z.object({
      team_keys: z.array(z.number()),
      surrogate_team_keys: z.array(z.number()).optional(),
      dq_team_keys: z.array(z.number()).optional()
    }),
    blue: z.object({
      team_keys: z.array(z.number()),
      surrogate_team_keys: z.array(z.number()).optional(),
      dq_team_keys: z.array(z.number()).optional()
    })
  }),
  pred: z.object({
    winner: z.string(),
    red_win_prob: z.number(),
    red_score: z.number(),
    blue_score: z.number()
  }).optional(),
  result: z.object({
    winner: z.string(),
    red_score: z.number(),
    blue_score: z.number(),
    red_no_foul: z.number(),
    blue_no_foul: z.number(),
    red_auto_points: z.number(),
    blue_auto_points: z.number(),
    red_teleop_points: z.number(),
    blue_teleop_points: z.number(),
    red_endgame_points: z.number(),
    blue_endgame_points: z.number()
  }).optional()
}).passthrough();
export type SbMatchData = z.infer<typeof SbMatchData>;