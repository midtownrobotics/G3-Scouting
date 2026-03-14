import { User } from "server/models/types";

const checkedInUsers = new Map<number, User>();

export function checkIn(user: User) {
    if (checkedInUsers.has(user.id)) return;
    checkedInUsers.set(user.id, user);
}

export function checkOut(userId: number) {
    checkedInUsers.delete(userId);
}

export function getCheckedInUsers() {
    return Array.from(checkedInUsers.values());
}

export function isUserCheckedIn(userId: number) {
    return checkedInUsers.has(userId);
}