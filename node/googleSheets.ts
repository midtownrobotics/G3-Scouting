import { ResponseCreationAttributes } from "./models/types";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SERVICE_ACCOUNT_FILE = path.join(__dirname + "/../storage/gapi-service-account.json");
const SHEETS_ID = "1rcEKW0mZ52PXnDiJKITzOaCCcISpALeu5wvh5vlqFAA";
const SHEET_NAME_PREFIX = "SSW_";

/**
 * Authorizes the Google Client API.
 * @returns An authenticated Google API Client.
 */
async function authorizeGoogleAPI() {
    try {
        return new google.auth.GoogleAuth({
            credentials: JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, "utf8")),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    } catch (err) {
        console.log("Could not authorize Google API.")
        return null;
    }
}

export async function sendDataToGoogleSheets(data: (number | string | undefined | null)[], sheet: string) {
    let listData: string[] = []

    for (let i = 0; i < data.length; i++) {
        const theData = data[i]
        if (typeof theData == "string") listData.push(theData);
        if (typeof theData == "number") listData.push(theData.toString());
        listData.push("");
    }

    appendToSheet([listData], `${sheet}!A1`)
}

/** 
 * Appends rows to a google sheet 
 * @param data The rows to append.
 * @param range The range to append to the sheet.
 */
async function appendToSheet(data: string[][], range: string) {
    const authClient = await authorizeGoogleAPI();
    if (!authClient) return;
    const sheets = google.sheets({ version: "v4", auth: authClient });

    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEETS_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values: data },
    });
}
