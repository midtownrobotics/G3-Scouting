import * as fs from 'fs';
import path from 'path';
import { Settings } from './types';
import { PRODUCTION } from '@shared/config';

function getSettingsFile(relativePath: string): Promise<any> {
    return new Promise<any>((resolve) => {
        fs.readFile(path.join(__dirname, relativePath), (err, data) => {
            let finalData: any;
            try {
                finalData = JSON.parse(data.toString());
            } catch {
                if (data === undefined) throw new Error("Your settings file does not exist.");
                finalData = data.toString();
            }
            resolve(finalData);
        });
    });
}

const settingsDir = PRODUCTION ? "/../../storage/settings.json" : "/storage/settings.json"

async function getSettings(): Promise<Settings> {
    const settings = await getSettingsFile(settingsDir) as Settings;
    return settings;
}

async function writeSettings(data: Settings) {
    return new Promise<true>((resolve, reject) => {
        fs.writeFile(
            path.join(__dirname, "storage/settings.json"),
            JSON.stringify(data, null, 2),
            (err) => {
                if (err) return reject(err);
                resolve(true);
            }
        );
    });
}

export async function getSettingsValue<T extends keyof Settings>(key: T): Promise<Settings[T]> {
    const settings = await getSettings();
    return settings[key];
}

export async function setSettingsValue<T extends keyof Settings>(key: T, value: Settings[T]) {
    const settings = await getSettings();
    settings[key] = value;
    await writeSettings(settings);
}