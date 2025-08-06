import z from 'zod'
import { Assignment, Block } from './schedule'
import { Permission } from '@shared/permissions';
import { NextMatch } from './data';

export const SimpleUser = z.object({
    username: z.string(),
    id: z.coerce.number(),
    permission: z.nativeEnum(Permission),
    reliable: z.coerce.boolean(),
    redAlliance: z.boolean()
})
export type SimpleUser = z.infer<typeof SimpleUser>

export const CreateUser = SimpleUser.and(z.object({
    password: z.string()
}))
export type CreateUser = z.infer<typeof CreateUser>

export const SaveableInputData = z.object({
    value: z.string()
})
export type SaveableInputData = z.infer<typeof SaveableInputData>

export const UserInformation = z.object({
    user: SimpleUser.and(z.object({
        schedule: z.array(z.object({
            block: Block,
            assignment: Assignment
        })),
        nextMatch: NextMatch.nullish()
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