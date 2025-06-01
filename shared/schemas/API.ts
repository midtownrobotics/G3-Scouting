import z from 'zod'

export const SimpleUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    id: z.coerce.number(),
    permissionId: z.coerce.number(),
    reliable: z.coerce.boolean()
})
export type SimpleUser = z.infer<typeof SimpleUserSchema>

export const PermissionSchema = z.object({
    id: z.number(),
    name: z.string(),
    blacklist: z.array(z.string())
})
export type Permission = z.infer<typeof PermissionSchema>

export const SaveableInputDataSchema = z.object({
    value: z.string()
})
export type SaveableInputData = z.infer<typeof SaveableInputDataSchema>