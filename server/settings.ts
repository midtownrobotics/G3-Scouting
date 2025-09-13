import * as fs from 'fs';
import path from 'path';
import { Settings } from './types';
import { PRODUCTION } from '@shared/config';

const settingsDir = PRODUCTION ? "/../../storage/settings.json" : "/storage/settings.json"

async function getSettings(): Promise<Settings> {
    return new Promise<any>((resolve) => {
        fs.readFile(path.join(__dirname, settingsDir), (err, data) => {
            let finalData: any;
            try {
                finalData = JSON.parse(data.toString());
            } catch {
                if (data === undefined) {
                    console.log("WARNING: \"settings.json\" not found. Resetting file...")
                    const settings: Settings = {
                        teamNumber: 0,
                        slackToken: '',
                        theBlueAlliance: '',
                        nexus: '',
                        eventKey: '',
                        match: {
                            number: 0,
                            teams: [],
                            blue: [],
                            red: []
                        }
                    };
                    writeSettings(settings);
                    finalData = settings;
                } else {
                    finalData = data.toString();
                }
            }
            resolve(finalData);
        });
    });
}

async function writeSettings(data: Settings) {
    return new Promise<true>((resolve, reject) => {
        fs.writeFile(
            path.join(__dirname, settingsDir),
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