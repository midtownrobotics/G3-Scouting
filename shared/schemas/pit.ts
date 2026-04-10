import { z } from "zod";

export const NexusMatch = z.object({
    label: z.string(),
    status: z.enum(["Queuing soon", "Now queuing", "On deck", "On field"]),
    redTeams: z.array(z.string().nullish()).nullish(),
    blueTeams: z.array(z.string().nullish()).nullish(),
    times: z.object({
        estimatedQueueTime: z.number().nullish(),
        estimatedOnDeckTime: z.number().nullish(),
        estimatedOnFieldTime: z.number().nullish(),
        estimatedStartTime: z.number().nullish(),
        actualQueueTime: z.number().nullish(),
        actualOnDeckTime: z.number().nullish(),
        actualOnFieldTime: z.number().nullish(),
    }),
    breakAfter: z.string().nullish(),
    replayOf: z.string().nullish()
});
export type NexusMatch = z.infer<typeof NexusMatch>;

export const NexusEventStatus = z.object({
    eventKey: z.string(),
    dataAsOfTime: z.number(),
    nowQueuing: z.string().nullish(),
    matches: z.array(NexusMatch),
    announcements: z.array(z.object({
        id: z.string(),
        announcement: z.string(),
        postedTime: z.number()
    })),
    partsRequests: z.array(z.object({
        id: z.string(),
        parts: z.string(),
        requestedByTeam: z.string(),
        postedTime: z.number()
    })),
}).passthrough();
export type NexusEventStatus = z.infer<typeof NexusEventStatus>;

export const RankingRow = z.object({
    rank: z.number(),
    wins: z.number(),
    losses: z.number(),
    ties: z.number(),
    rp: z.number(),
    epa: z.number(),
});
export type RankingRow = z.infer<typeof RankingRow>;

export enum BatteryState {
    CHARGING = "Charging",
    IN_ROBOT = "In Robot",
    IDLE = "Idle",
    BROKEN = "Broken",
    MATCH = "Match"
}

export const BatteryData = z.object({
    id: z.number().optional(),
    name: z.string(),
    state: z.nativeEnum(BatteryState),
    voltage: z.number().nullish(),
    stateSince: z.number()
})
export type BatteryData = z.infer<typeof BatteryData>;

export const PitMonitorData = z.object({
    team: z.number(),
    pitNow: z.array(z.string()),
    ranking: RankingRow.nullish(),
    nexusData: NexusEventStatus.nullish(),
    batteryData: z.array(BatteryData),
    checklist: z.array(z.string())
});
export type PitMonitorData = z.infer<typeof PitMonitorData>;