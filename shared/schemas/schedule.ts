import { DateString } from "@shared/types";
import { z } from "zod";

export enum AssignmentType {
    BREAK = "Break",
    SCOUTING = "Scouting"
}

export const Assignment = z.object({
    color: z.string(),
    name: z.string(),
    type: z.nativeEnum(AssignmentType),
    id: z.number()
});
export type Assignment = z.infer<typeof Assignment>;

export const SendableSchedule = z.object({
    userId: z.number(),
    assignments: z.array(z.object({
        blockId: z.number(),
        assignmentId: z.number()
    }))
});
export type SendableSchedule = z.infer<typeof SendableSchedule>;

export const Block = z.object({
    date: z.string(),
    time: z.number(),
    id: z.number()
})
/** A block of time with a specific date and time. Increments of 30mins. */
export type Block = {
    date: DateString,
    /** Time in minutes from 12:00 AM (0mins-1440mins). Increments of 30mins. */
    time: number,
    /** Time since epoch for this block in ms. */
    id: number
}

export const DeployPayload = z.object({
    assignments: z.array(Assignment),
    schedules: z.array(SendableSchedule),
    blocks: z.array(Block)
})
export type DeployPayload = z.infer<typeof DeployPayload>