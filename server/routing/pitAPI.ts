import { PitMonitorData } from '@shared/schemas/pit';
import express from 'express';
import { getMatchData, getTeamEventData, getTeamMatchData } from '../externalApis/tba/tba';
import { getTeamData } from '../externalApis/statbotics/statbotics';

const pitAPIRouter = express.Router();

pitAPIRouter.get("/data", async (req, res) => {
    const team = 1648;

    const tbaEventData = await getTeamEventData(team);
    const tbaMatches = await getTeamMatchData(team);
    const sbData = await getTeamData(team);

    if (!tbaEventData || !sbData || !tbaMatches) { res.send(400); return; };

    const data: PitMonitorData = {
        team: team,
        pitNow: [],
        ranking: {
            wins: tbaEventData.qual.ranking.record.wins,
            losses: tbaEventData.qual.ranking.record.losses,
            ties: tbaEventData.qual.ranking.record.ties,
            rank: sbData.district_rank,
            rp: sbData.district_points,
            epa: sbData.epa.breakdown.total_points
        },
        upcoming: (
            tbaMatches
                .filter(m => m.comp_level === "qm")
                .map(m => ({
                    blue: m.alliances.blue.team_keys.map(t => parseInt(t.slice(3))),
                    red: m.alliances.red.team_keys.map(t => parseInt(t.slice(3))),
                    number: m.match_number,
                    key: m.key
                }))
                .sort((a, b) => a.number - b.number)
        )
    };

    res.send(data);
});

export default pitAPIRouter;