import crypto from "crypto";
import UserModel from "../models/users/UserModel";

const slackCmdLinkCodes = new Map<string, { userId: number; expiresAt: number; }>();

function generateCode(length: number): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = crypto.randomBytes(length);
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return code;
}

export function createLinkCode(userId: number): string {
    const part = () => generateCode(4);
    const code = `${part()}-${part()}`;
    const expiresAt = Date.now() + 10 * 60 * 1000;
    slackCmdLinkCodes.forEach((v, k) => v.userId == userId && slackCmdLinkCodes.delete(k));
    slackCmdLinkCodes.set(code, { userId, expiresAt });
    return code;
}

function validateLinkCode(code: string): number | null {
    const entry = slackCmdLinkCodes.get(code);
    if (!entry || entry.expiresAt < Date.now()) {
        slackCmdLinkCodes.delete(code);
        return null;
    }
    return entry.userId;
}

export async function linkWithCmd(code: string, userSlackId: string) {
    const userId = validateLinkCode(code);
    if (!userId) return false;

    const user = await UserModel.findByPk(userId);
    if (!user) return false;

    user.update({ slackId: userSlackId });
    return true;
}