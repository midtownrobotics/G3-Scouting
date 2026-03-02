import path from "path";
import { z, ZodType } from "zod";
import { getSettingsValue } from "../../other/settings";
import {
    TbaMatchData,
    TbaTeamEventData,
    TbaTeamMediaData,
    TbaTeamSimpleData,
} from "./types";

/**
 * Low-level helper to fetch data from TBA with API key included.
 * @param url Relative API path (e.g. `/event/.../matches`).
 */
async function fetchTba(url: string): Promise<Response | undefined> {
    const key = await getSettingsValue("theBlueAlliance");
    if (!key) return undefined;

    try {
        return await fetch(
            "https://" + path.join("www.thebluealliance.com/api/v3/", url),
            {
                method: "GET",
                headers: {
                    "X-TBA-Auth-Key": key,
                },
            }
        );
    } catch {
        return undefined;
    }
}

/**
 * Generic helper that fetches from TBA and parses the result with Zod.
 * @param url Relative API path.
 * @param schema Zod schema for the expected response.
 * @returns Parsed data or `undefined` if fetch/parse failed.
 */
async function fetchAndParse<T>(
    url: string,
    schema: ZodType<T>
): Promise<T | undefined> {
    const response = await fetchTba(url);
    if (!response) return undefined;

    try {
        const json = await response.json();
        const result = schema.safeParse(json);
        return result.success ? result.data : undefined;
    } catch {
        return undefined;
    }
}

const matchDataCache = new Map<number, TbaMatchData>();
/**
 * Gets match data from TBA for the current event and a specified match.
 * @param match The match number.
 * @returns An object of {@link TbaMatchData} or `undefined` if request or parse was unsuccessful.
 */
export async function getMatchData(
    match: number
): Promise<TbaMatchData | undefined> {
    if (matchDataCache.has(match)) return matchDataCache.get(match);
    const event = await getSettingsValue("eventKey");
    const data = await fetchAndParse(`/match/${event}_qm${match}`, TbaMatchData);
    if (data && hasMatchHappened(data)) matchDataCache.set(match, data);
    return data;
}

export function hasMatchHappened(matchData: TbaMatchData) {
    if (matchData.actual_time === undefined || matchData.actual_time === null) return false;
    return true;
}

/**
 * Gets all matches in order for the current event.
 * @returns An array of {@link TbaMatchData} or `undefined` if request or parse was unsuccessful.
 */
export async function getAllMatches(): Promise<TbaMatchData[] | undefined> {
    const event = await getSettingsValue("eventKey");
    return fetchAndParse(`/event/${event}/matches`, z.array(TbaMatchData));
}

/**
 * Gets team data for a team at an event.
 * @returns Team data in the form of {@link TbaTeamEventData}.
 */
export async function getTeamEventData(
    team: number
): Promise<TbaTeamEventData | undefined> {
    const event = await getSettingsValue("eventKey");
    return fetchAndParse(`/team/frc${team}/event/${event}/status`, TbaTeamEventData);
}

/**
 * Gets match data for a team at an event.
 * @returns An array of {@link TbaMatchData} or `undefined`.
 */
export async function getTeamMatchData(
    team: number
): Promise<TbaMatchData[] | undefined> {
    const event = await getSettingsValue("eventKey");
    return fetchAndParse(`/team/frc${team}/event/${event}/matches`, z.array(TbaMatchData));
}

/**
 * Gets all teams attending the current event.
 * @returns An array of {@link TbaTeamSimpleData} or `undefined`.
 */
export async function getAllTeams(): Promise<TbaTeamSimpleData[] | undefined> {
    const event = await getSettingsValue("eventKey");
    return fetchAndParse(`/event/${event}/teams/simple`, z.array(TbaTeamSimpleData));
}

/**
 * Gets all team media data.
 * @returns An array of {@link TbaTeamMediaData} or `undefined`. 
 */
export async function getTeamMedia(team: number): Promise<TbaTeamMediaData[] | undefined> {
    const year = new Date().getFullYear();
    return fetchAndParse(`/team/frc${team}/media/${year}`, z.array(TbaTeamMediaData));
}

/**
 * Gets team simple data.
 * @returns Team data in the form of {@link TbaTeamSimpleData} or `undefined`. 
 */
export async function getTeamData(team: number): Promise<TbaTeamSimpleData | undefined> {
    return fetchAndParse(`/team/frc${team}/simple`, TbaTeamSimpleData);
}