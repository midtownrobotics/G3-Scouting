import ResponseModel from "./models/ResponseModel";
import { ResponseCreationAttributes } from "./models/types";
import UserModel from "./models/UserModel";
import { ResponseKeyValuePair } from "./types";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { TBA } from ".";
import TheBlueAllianceV3, { APICalls, MatchFull } from "thebluealliancev3";
import { getSettings } from "./storage";
import { Op } from "sequelize";

const SERVICE_ACCOUNT_FILE = path.join(__dirname + "/../storage/gapi-service-account.json");
const SHEETS_ID = "1rcEKW0mZ52PXnDiJKITzOaCCcISpALeu5wvh5vlqFAA";
const SHEET_NAME_PREFIX = "SSW_";

const matchesNeedingConfidenceRating = new Set<number>();

export default function (keyValuePairs: ResponseKeyValuePair[], sheet: string, user?: UserModel) {
    const data: { [field: string]: string } = {}

    keyValuePairs.forEach(e => {
        data[e.name] = e.value
    });

    data.scoutId = user?.id?.toString() ?? "UNKNOWN"
    data.scout = user?.username ?? "UNKNOWN"

    const typedData = data as unknown as ResponseCreationAttributes

    if (parseInt(typedData.matchNum)) {
        matchesNeedingConfidenceRating.add(parseInt(typedData.matchNum))
        user?.update({ lastMatchScouted: parseInt(typedData.matchNum) })
    }
    
    ResponseModel.create(typedData)
    sendDataToGoogleSheets(typedData, SHEET_NAME_PREFIX + sheet)
}

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

async function sendDataToGoogleSheets(data: ResponseCreationAttributes, sheet: string) {
    let listData: string[] = []
    const keys = Object.keys(data) as (keyof ResponseCreationAttributes)[]

    for (let i = 0; i < keys.length; i++) {
        const theData = data[keys[i]]
        if (typeof theData == "string") listData.push(theData);
        if (typeof theData == "number") listData.push(theData.toString());
        if (typeof theData == "undefined") listData.push("");
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

/** Gives unrated matches a confidence rating. */
async function rateUnratedMatches() {
    const event_key = (await getSettings()).eventKey
}

rateUnratedMatches()

/**
 * Gives specifed match a cofidence rating.
 * @param matchNumber The match number to be rated.
 * @param matches The match data for the event. List of {@link MatchFull}s.
 */
async function rateMatch(matchNumber: number, matches: MatchFull[]) {
    const matchData = matches.find((m) => m.match_number == matchNumber);
    const responses = await ResponseModel.findAll({ where: { matchNum: matchNumber }})
}

function getSimplifiedScoreBreakdown(matchData: MatchFull, blue: boolean) {
    const alliance = blue ? "blue" : "red"
    return {
        teleop: {
            L1: matchData.score_breakdown[alliance].teleopReef.trough as number,
            L2: matchData.score_breakdown[alliance].teleopReef.tba_botRowCount as number,
            L3: matchData.score_breakdown[alliance].teleopReef.tba_midRowCount as number,
            L4: matchData.score_breakdown[alliance].teleopReef.tba_topRowCount as number,
        },
        auto: {
            L1: matchData.score_breakdown[alliance].autoReef.trough as number,
            L2: matchData.score_breakdown[alliance].autoReef.tba_botRowCount as number,
            L3: matchData.score_breakdown[alliance].autoReef.tba_midRowCount as number,
            L4: matchData.score_breakdown[alliance].autoReef.tba_topRowCount as number,
        }
    }
}