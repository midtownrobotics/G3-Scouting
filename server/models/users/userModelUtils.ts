import { SimpleUser } from "@shared/schemas/API";
import { getSettings } from "../../storage";
import { Settings } from "../../types";
import UserModel from "./UserModel";

export async function getUserFromAuth(authHeader: string | undefined): Promise<UserModel | undefined> {
    if (!authHeader) return undefined;
    const auth = Buffer.from(authHeader.substring(6), 'base64').toString().split(':');
    const username = auth[0], password = auth[1];
    const users = await UserModel.findAll()
    return users.find((u) => u.username == username && u.password == password)
}

export async function isValidUser(user: SimpleUser): Promise<boolean> {
    const settings: Settings = await getSettings();

    if (!user.username || !user.password ||
        user.permissionId === undefined || user.reliable === undefined ||
        !settings.permissionLevels.some(p => p.id == user.permissionId)) {
        return false;
    }
    return true;
}
