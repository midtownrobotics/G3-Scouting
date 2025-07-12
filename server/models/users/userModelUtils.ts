import { SimpleUser } from "@shared/schemas/API";
import { getSettings } from "../../storage";
import { Settings } from "../../types";

export async function isValidUser(user: SimpleUser): Promise<boolean> {
    const settings: Settings = await getSettings();

    if (user.username === undefined ||
        user.permissionId === undefined || user.reliable === undefined ||
        !settings.permissionLevels.some(p => p.id == user.permissionId)) {
        return false;
    }
    return true;
}
