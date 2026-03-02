import * as tba from "server/externalApis/tba/tba";
import recordDataForMatch from "./recordDataForMatch";

const matchesWithData: number[] = [];

export default async function updateAllVdrData() {
    const matchNumbers = (await tba.getAllMatches())?.filter(m => m.comp_level === "qm").map(m => m.match_number);
    if (matchNumbers === undefined) return;

    for (const match of matchNumbers) {
        if (matchesWithData.includes(match)) continue;

        const matchData = await tba.getMatchData(match);
        if (matchData === undefined) return;

        const res = await recordDataForMatch(match);
        if (res.success) {
            matchesWithData.push(match);
        }
    }
}