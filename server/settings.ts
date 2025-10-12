import { promises as fs } from "fs";
import path from "path";
import { Settings } from "./types";
import { PRODUCTION } from "@shared/config";

const settingsPath = PRODUCTION
    ? path.resolve(__dirname, "../../storage/settings.json")
    : path.resolve(__dirname, "storage/settings.json");

let settingsCache: Settings | undefined;

const defaultSettings: Settings = {
    teamNumber: 0,
    slackToken: "",
    theBlueAlliance: "",
    nexus: "",
    eventKey: "",
    match: {
        number: 0,
        teams: [],
        blue: [],
        red: [],
    },
};

/**
 * Loads settings.json (cached after first call).
 * If the file does not exist or is invalid JSON, resets to defaults.
 */
async function getSettings(): Promise<Settings> {
    if (settingsCache) return settingsCache;

    try {
        const file = await fs.readFile(settingsPath, "utf-8");
        const parsed = JSON.parse(file) as Settings;
        settingsCache = parsed;
        return parsed;
    } catch (err) {
        console.warn(
            `WARNING: "settings.json" missing or invalid. Resetting file at ${settingsPath}...`
        );
        await writeSettings(defaultSettings);
        return defaultSettings;
    }
}

/**
 * Writes settings.json and updates cache.
 */
async function writeSettings(data: Settings): Promise<true> {
    settingsCache = { ...data };
    await fs.writeFile(settingsPath, JSON.stringify(settingsCache, null, 2));
    return true;
}

/**
 * Gets a single value from settings.
 */
export async function getSettingsValue<T extends keyof Settings>(key: T): Promise<Settings[T]> {
    const settings = await getSettings();
    return settings[key];
}

/**
 * Updates a single setting and persists the file.
 */
export async function setSettingsValue<T extends keyof Settings>(key: T, value: Settings[T]): Promise<void> {
    const settings = await getSettings();
    const updated: Settings = { ...settings, [key]: value };
    await writeSettings(updated);
}