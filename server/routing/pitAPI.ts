import { BatteryState, PitMonitorData } from '@shared/schemas/pit';
import express from 'express';
import { getTeamEventData, getTeamMatchData } from '../externalApis/tba/tba';
import { getTeamData } from '../externalApis/statbotics/statbotics';
import { getEventStatus } from '../externalApis/nexus/nexus';
import { z } from 'zod';
import BatteryModel from '../models/battery/BatteryModel';

const pitAPIRouter = express.Router();

pitAPIRouter.get("/data", async (req, res) => {
    const team = 1648;

    const tbaEventData = await getTeamEventData(team);
    const tbaMatches = await getTeamMatchData(team);
    const sbData = await getTeamData(team);
    const nexusData = await getEventStatus();
    const batteryData = await BatteryModel.findAll();

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
        },
        batteryData
    };

    res.send(data);
});

pitAPIRouter.get("/batteries", async (req, res) => {
    const batteries = await BatteryModel.findAll();
    res.send(batteries);
})

pitAPIRouter.post("/setBatteryState", async (req, res) => {
    const body = z.object({ id: z.number(), state: z.nativeEnum(BatteryState) }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    const battery = await BatteryModel.findByPk(body.data.id);
    battery?.update({ state: body.data.state, stateSince: Date.now() });

    res.send(200);
});

pitAPIRouter.post("/newBattery", async (req, res) => {
    const body = z.object({ name: z.string() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    await BatteryModel.create({
        name: req.body.name,
        state: BatteryState.IDLE,
        stateSince: Date.now()
    });

    res.send(200);
});

pitAPIRouter.post("/deleteBattery", async (req, res) => {
    const body = z.object({ id: z.number() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    const battery = await BatteryModel.findByPk(body.data.id);
    battery?.destroy();

    res.send(200);
});

export default pitAPIRouter;