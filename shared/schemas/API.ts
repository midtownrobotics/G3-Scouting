import z from 'zod'
import { Assignment, Block } from './schedule'

export const SimpleUser = z.object({
    username: z.string(),
    id: z.coerce.number(),
    permissionId: z.coerce.number(),
    reliable: z.coerce.boolean(),
    redAlliance: z.boolean()
})
export type SimpleUser = z.infer<typeof SimpleUser>

export const CreateUser = SimpleUser.and(z.object({
    password: z.string()
}))
export type CreateUser = z.infer<typeof CreateUser>

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
        schedule: z.array(z.object({
            block: Block,
            assignment: Assignment
        }))
    })),
    currentAssignment: Assignment.optional()
});
export type UserInformation = z.infer<typeof UserInformation>

export const SlackData = z.object({
    id: z.string(),
    profile: z.object({
        real_name: z.string(),
        image_24: z.string(),
        email: z.string()
    })
})
export type SlackData = z.infer<typeof SlackData>