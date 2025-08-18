import { DateString } from "@shared/types";
import { z } from "zod";

export enum AssignmentType {
    BREAK = "Break",
    ASSIGNED = "Assigned",
    PIT = "Pit",
    OTHER = "Other"
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
    date: DateString,
    time: z.number(),
    id: z.number()
})
export type Block = z.infer<typeof Block>

export const DeployPayload = z.object({
    assignments: z.array(Assignment),
    schedules: z.array(SendableSchedule),
    blocks: z.array(Block)
})
export type DeployPayload = z.infer<typeof DeployPayload>

export const UserBlockAssignment = z.object({
    block: Block,
    assignment: Assignment
});
export type UserBlockAssignment = z.infer<typeof UserBlockAssignment>

export const UserScheduleData = z.object({
    id: z.number(),
    name: z.string(),
    schedule: z.array(UserBlockAssignment),
    current: Assignment.optional()
})
export type UserScheduleData = z.infer<typeof UserScheduleData>;