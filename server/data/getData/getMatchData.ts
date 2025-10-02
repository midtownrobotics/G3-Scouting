import { ExtendedMatchData } from "@shared/schemas/data";
import { getMatchData as getTbaMatchData } from "server/externalApis/tba/tba";

export default async function getMatchData(match: number): Promise<ExtendedMatchData | undefined> {
    const tbaData = await getTbaMatchData(match);
    if (!tbaData) return;

    const blue = tbaData.alliances.blue.team_keys.map(t => parseInt(t.substring(3)));
    const red = tbaData.alliances.red.team_keys.map(t => parseInt(t.substring(3)));
    const time = typeof tbaData.actual_time === "number" ? new Date(tbaData.actual_time * 1000) : undefined
    
    return {
        number: tbaData.match_number,
        blue,
        red,
        teams: [...red, ...blue],
        score: {
            red: tbaData.alliances.red.score,
            blue: tbaData.alliances.red.score
        },
        winner: tbaData.winning_alliance,
        posted: time != undefined && time.getTime() < Date.now(),
        time
    }
}