import { z } from 'zod';
import { Assignment, UserBlockAssignment } from './schedule';
import { Permission } from '../permissions';
import { NextMatch } from './data';

export const SimpleUser = z.object({
    username: z.string(),
    displayName: z.string().nullish(),
    title: z.string().nullish(),
    id: z.coerce.number(),
    permission: z.nativeEnum(Permission),
    reliable: z.coerce.boolean(),
    redAlliance: z.boolean(),
    slackLinked: z.boolean(),
    tokens: z.number(),
    xp: z.number()
});
export type SimpleUser = z.infer<typeof SimpleUser>;

export const CreateUser = SimpleUser.and(z.object({
    password: z.string()
}));
export type CreateUser = z.infer<typeof CreateUser>;

export const NotificationService = z.enum(["game", "userMessaging"]);
export type NotificationService = z.infer<typeof NotificationService>;

export const Notification = z.object({
    to: z.number().or(z.literal("allUsers")),
    from: z.object({
        user: z.object({
            id: z.number(),
            username: z.string(),
            displayName: z.string()
        }).optional(),
        service: NotificationService
    }),
    message: z.string(),
    expiresAt: z.number(),
    sentAt: z.number(),
    priority: z.number()
})
export type Notification = z.infer<typeof Notification>;

export const UserInformation = z.object({
    user: SimpleUser.and(z.object({
        schedule: z.array(UserBlockAssignment),
        nextMatch: NextMatch.nullish()
    })),
    checkedIn: z.boolean(),
    currentAssignment: Assignment.optional(),
    notifications: z.array(Notification)
});
export type UserInformation = z.infer<typeof UserInformation>;

export const SlackData = z.object({
    id: z.string(),
    profile: z.object({
        real_name: z.string(),
        first_name: z.string(),
        display_name: z.string().optional(),
        image_1024: z.string().optional(),
        image_24: z.string().optional(),
        email: z.string().optional()
    }).passthrough()
}).passthrough();
export type SlackData = z.infer<typeof SlackData>;

export const UserProfile = z.object({
    id: z.number(),
    username: z.string(),
    displayName: z.string().nullish(),
    tokens: z.number(),
    xp: z.number(),
    title: z.string().nullish()
});
export type UserProfile = z.infer<typeof UserProfile>;