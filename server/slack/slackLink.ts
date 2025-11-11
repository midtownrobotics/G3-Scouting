import crypto from "crypto";
import UserModel from "../models/users/UserModel";
import { SlackData } from "@shared/schemas/user";
import { parse } from "path";
import { getSettingsValue } from "server/other/settings";

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

    const slackData = await getUserSlackData(userSlackId);
    const displayName = (
        user.displayName ??
        slackData?.profile.display_name ??
        slackData?.profile.first_name ??
        slackData?.profile.real_name
    )?.substring(0, 15);

    user.update({ slackId: userSlackId, displayName });
    return true;
}

export async function getUserSlackData(user: UserModel | undefined): Promise<SlackData | undefined>
export async function getUserSlackData(id: string | undefined): Promise<SlackData | undefined>
export async function getUserSlackData(data?: UserModel | string) {
    const id = typeof data === "string" ? data : data?.slackId
    if (!id) return;
    const token = await getSettingsValue("slackToken");

    const slackRes = await fetch(`https://slack.com/api/users.info?user=${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const jsonData = (await slackRes.json()).user
    const parsed = SlackData.safeParse(jsonData);
    if (parsed.success) return parsed.data;
}