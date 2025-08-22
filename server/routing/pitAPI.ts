import { PitMonitorData } from '@shared/schemas/pit';
import express from 'express';
import { getTeamEventData, getTeamMatchData } from '../externalApis/tba/tba';
import { getTeamData } from '../externalApis/statbotics/statbotics';
import { getEventStatus } from '../externalApis/nexus/nexus';

const pitAPIRouter = express.Router();

pitAPIRouter.get("/data", async (req, res) => {
    const team = 1648;

    const tbaEventData = await getTeamEventData(team);
    const tbaMatches = await getTeamMatchData(team);
    const sbData = await getTeamData(team);
    const nexusData = await getEventStatus();

    if (!tbaEventData || !sbData || !tbaMatches || !nexusData) { res.send(400); return; };

    const data: PitMonitorData = {
        team,
        pitNow: [],
        nexusData,
        ranking: {
            wins: tbaEventData.qual.ranking.record.wins,
            losses: tbaEventData.qual.ranking.record.losses,
            ties: tbaEventData.qual.ranking.record.ties,
            rank: sbData.district_rank,
            rp: sbData.district_points,
            epa: sbData.epa.breakdown.total_points
        }
    };

    res.send(data);
});

export default pitAPIRouter;