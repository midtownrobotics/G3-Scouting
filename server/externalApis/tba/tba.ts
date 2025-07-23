import path from 'path';
import { getSettings } from '../../storage';
import { TbaMatchData } from './types';

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
    ))
}

/**
 * Gets match data from TBA.
 * @param match The match number.
 * @returns The {@link TbaMatchData
 * } or `false` if request or parse was unsuccessful.
 */
export async function getMatchData(match: number): Promise<TbaMatchData | false> {
    const event = (await getSettings()).eventKey;
    const fetched = await fetchTba("/match/" + event + "_qm" + match);
    if (!fetched) return false;
    const data = TbaMatchData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return false;
}