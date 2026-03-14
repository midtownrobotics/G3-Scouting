import { Notification, NotificationService } from "@shared/schemas/user";

const MAX_NOTIFICATIONS_PER_USER = 20;

// notifications are intentionally in-memory and ephemeral
const notificationsByUser = new Map<number, Notification[]>();

/**
 * Sends a notification.
 * @param message The message.
 * @param from The service that sent the message.
 * @param expires When the message expires.
 * @param priority What priority by which the message should be displayed.
 * @param userId Either the id of the user the notification is for or `undefined` to send to all users.
 */
export function sendNotification(
    message: string,
    from: NotificationService,
    expires: Date,
    priority: number,
    userId?: number
) {
    const userNotifications = notificationsByUser.get(userId ?? -1) ?? [];

    userNotifications.push({
        message,
        to: userId ?? "allUsers",
        from: { service: from },
        expiresAt: expires.getTime(),
        sentAt: Date.now(),
        priority
    });

    if (userNotifications.length > MAX_NOTIFICATIONS_PER_USER) {
        userNotifications.splice(0, userNotifications.length - MAX_NOTIFICATIONS_PER_USER);
    }

    notificationsByUser.set(userId ?? -1, userNotifications);
}

export function getNotifications(userId: number): Notification[] {
    return (notificationsByUser.get(userId) ?? []).concat(notificationsByUser.get(-1) ?? []);
}