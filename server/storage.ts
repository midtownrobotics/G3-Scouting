import * as fs from 'fs';
import { Settings } from './types';
import path from 'path';

async function getFile(relativePath: string): Promise<any> {
    return new Promise<any>((resolve) => {
        fs.readFile(path.join(__dirname, relativePath), (err, data) => {
            let finalData: any;
            try {
                finalData = JSON.parse(data.toString())
            } catch {
                finalData = data.toString()
            }
            resolve(finalData)
        })
    })
}

export async function getSettings(): Promise<Settings> {
    const settings = await getFile("/storage/settings.json") as Settings;
    return settings
}

export function getSettingsSync(): Settings {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../storage/settings.json")).toString()) as Settings
}

export function writeSettings(data: Settings) {
    fs.writeFile(path.join(__dirname, "/storage/settings.json"), JSON.stringify(data), () => {})
}