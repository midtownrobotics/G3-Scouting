import path from 'path';
import { z } from 'zod';
import { getSettingsValue } from '../../settings';
import { TbaMatchData, TbaRankingData, TbaTeamEventData } from './types';

async function fetchTba(url: string) {
    const key = await getSettingsValue("theBlueAlliance");

    return (await fetch(
        ("https://" + path.join("www.thebluealliance.com/api/v3/", url)),
        {
            method: "GET",
            headers: {
                "X-TBA-Auth-Key": key
            }
        }
    ));
}

/**
 * Gets match data from TBA for the current event and a specified match.
 * @param match The match number.
 * @returns An object of {@link TbaMatchData} or `undefined` if request or parse was unsuccessful.
 */
export async function getMatchData(match: number): Promise<TbaMatchData | undefined> {
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchTba("/match/" + event + "_qm" + match);
    if (!fetched) return undefined;
    const data = TbaMatchData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}

/** 
 * Gets all matches in order for the current event.
 * @returns An array of {@link TbaMatchData} or `undefined` if request or parse was unsuccessful.
 */
export async function getAllMatches(): Promise<TbaMatchData[] | undefined> {
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchTba("/event/" + event + "/matches");
    if (!fetched) return undefined;
    const data = z.array(TbaMatchData).safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}

/** 
 * Gets team data for a team at an event.
 * @returns Team data in the form of {@link TbaTeamEventData}.
 */
export async function getTeamEventData(team: number): Promise<TbaTeamEventData | undefined> {
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchTba(`/team/frc${team}/event/${event}/status`);
    if (!fetched) return undefined;
    const data = TbaTeamEventData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}

export async function getTeamMatchData(team: number): Promise<TbaMatchData[] | undefined> {
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchTba(`/team/frc${team}/event/${event}/matches`);
    if (!fetched) return undefined;
    const data = z.array(TbaMatchData).safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}