import path from 'path';
import { getSettings } from '../../storage';
import { TbaMatchData } from './types';
import { z } from 'zod';

export async function fetchTba(url: string) {
    const key = (await getSettings()).keys.theBlueAlliance;

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
 * @returns An object of {@link TbaMatchData} or `false` if request or parse was unsuccessful.
 */
export async function getMatchData(match: number): Promise<TbaMatchData | false> {
    const event = (await getSettings()).eventKey;
    const fetched = await fetchTba("/match/" + event + "_qm" + match);
    if (!fetched) return false;
    const data = TbaMatchData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return false;
}

/** 
 * Gets all matches in order for the current event.
 * @returns An array of numbers or `false` if request or parse was unsuccessful.
 */
export async function getAllMatches() {
    const event = (await getSettings()).eventKey;
    const fetched = await fetchTba("/event/" + event + "/matches/keys");
    if (!fetched) return false;
    const data = z.array(z.string()).safeParse(await fetched.json());
    if (data.success) {
        return data
        .data
        .filter(key => /_qm\d+$/.test(key))
        .map(key => parseInt(key.match(/_qm(\d+)$/)![1]))
        .sort((a, b) => a - b);
    }
    return false;
}