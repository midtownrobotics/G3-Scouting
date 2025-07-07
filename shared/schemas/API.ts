import z from 'zod'
import { Assignment, UserAssignment } from './schedule'

export const SimpleUser = z.object({
    username: z.string(),
    password: z.string(),
    id: z.coerce.number(),
    permissionId: z.coerce.number(),
    reliable: z.coerce.boolean(),
    redAlliance: z.boolean()
})
export type SimpleUser = z.infer<typeof SimpleUser>

export const Permission = z.object({
    id: z.number(),
    name: z.string(),
    blacklist: z.array(z.string())
})
export type Permission = z.infer<typeof Permission>

export const SaveableInputData = z.object({
    value: z.string()
})
export type SaveableInputData = z.infer<typeof SaveableInputData>

export const UserInformation = z.object({
    user: SimpleUser.and(z.object({
        schedule: z.array(UserAssignment)
    })),
    currentAssignment: Assignment.optional()
});
export type UserInformation = z.infer<typeof UserInformation>;