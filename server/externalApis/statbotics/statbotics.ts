import path from 'path';
import { SbMatchData, SbTeamData } from './types';
import { getSettingsValue } from 'server/other/settings';

async function fetchSb(url: string) {
    return (await fetch(
        ("https://" + path.join("api.statbotics.io/v3/", url)),
        {
            method: "GET"
        }
    ));
}

export async function getTeamData(team: number): Promise<SbTeamData | undefined> {
    const year = new Date().getFullYear();
    const fetched = await fetchSb(`/team_year/${team}/${year}`);
    if (!fetched) return undefined;
    const data = SbTeamData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}

const matchDataCache = new Map<number, SbMatchData>();
export async function getMatchData(match: number): Promise<SbMatchData | undefined> {
    if (matchDataCache.has(match)) return matchDataCache.get(match);
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchSb(`/match/${event}_qm${match}`);
    if (!fetched) return undefined;
    const data = SbMatchData.safeParse(await fetched.json());
    if (data.success) {
        if (hasMatchHappened(data.data)) matchDataCache.set(match, data.data)
        return data.data;
    }
    return undefined;
}

export function hasMatchHappened(sbMatchData?: SbMatchData) {
    if (!sbMatchData) return false;
    const redScore = sbMatchData.result?.red_score;
    if (redScore === undefined || redScore === null) return false;
    const blueScore = sbMatchData.result?.blue_score;
    if (blueScore === undefined || blueScore === null) return false;
    // if (redScore === 0 && blueScore === 0) return false;
    return true;
}