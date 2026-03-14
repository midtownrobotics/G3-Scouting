import * as tba from "server/externalApis/tba/tba";
import recordDataForMatch from "./recordDataForMatch";
import FormResponseByTeamModel from "server/models/forms/FormResponseModels";

const matchesWithData: number[] = [];

export default async function updateAllVdrData() {
    const matchNumbers = (await tba.getAllMatches())?.filter(m => m.comp_level === "qm").map(m => m.match_number);
    if (matchNumbers === undefined) return;
    
    const vdrData = await FormResponseByTeamModel.getVirtualData();

    for (const match of matchNumbers) {
        if (matchesWithData.includes(match)) continue;
        if (vdrData.responses.some(r => r.match === match)) {
            matchesWithData.push(match);
            continue;
        };

        const matchData = await tba.getMatchData(match);
        if (matchData === undefined || !tba.hasMatchHappened(matchData)) return;

        const res = await recordDataForMatch(match);
        console.log(match, res);
        if (res.success) {
            matchesWithData.push(match);
        }
    }
}