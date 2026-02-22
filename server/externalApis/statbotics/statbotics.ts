import path from 'path';
import { SbTeamData } from './types';
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

export async function getMatchData(match: number): Promise<SbTeamData | undefined> {
    const event = await getSettingsValue("eventKey");
    const fetched = await fetchSb(`/match/${event}_qm${match}`);
    if (!fetched) return undefined;
    const data = SbTeamData.safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}