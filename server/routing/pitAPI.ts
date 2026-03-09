import { BatteryState, PitMonitorData } from '@shared/schemas/pit';
import express from 'express';
import { getTeamEventData, getTeamMatchData } from '../externalApis/tba/tba';
import { getTeamData } from '../externalApis/statbotics/statbotics';
import { getEventStatus } from '../externalApis/nexus/nexus';
import { z } from 'zod';
import BatteryModel from '../models/pit/BatteryModel';
import { getSettingsValue, setSettingsValue } from 'server/other/settings';
import { BodyText } from 'react-bootstrap-icons';

const pitAPIRouter = express.Router();

pitAPIRouter.get("/data", async (req, res) => {
    const team = 1648;

    const tbaEventData = await getTeamEventData(team);
    const sbData = await getTeamData(team);
    const nexusData = await getEventStatus();
    const batteryData = await BatteryModel.findAll();
    const checklist = await getSettingsValue("pitChecklist");

    const data: PitMonitorData = {
        team,
        pitNow: [],
        nexusData,
        ranking: (!tbaEventData || !sbData) ? undefined : {
            wins: tbaEventData.qual.ranking.record.wins,
            losses: tbaEventData.qual.ranking.record.losses,
            ties: tbaEventData.qual.ranking.record.ties,
            rank: sbData.district_rank,
            rp: sbData.district_points,
            epa: sbData.epa.breakdown.total_points
        },
        batteryData,
        checklist
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
    battery?.update({ state: body.data.state, stateSince: Date.now(), voltage: null });

    res.send(200);
});

pitAPIRouter.post("/setBatteryVoltage", async (req, res) => {
    const body = z.object({ id: z.number(), voltage: z.number() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    const battery = await BatteryModel.findByPk(body.data.id);
    battery?.update({ voltage: body.data.voltage });

    res.send(200);
});

pitAPIRouter.post("/newBattery", async (req, res) => {
    const body = z.object({ name: z.string() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    await BatteryModel.create({
        name: req.body.name,
        state: BatteryState.IDLE,
        stateSince: Date.now(),
        voltage: 0
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

pitAPIRouter.post("/addChecklistItem", async (req, res) => {
    const body = z.object({ item: z.string() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    const current = await getSettingsValue("pitChecklist");
    current.push(body.data.item);
    await setSettingsValue("pitChecklist", current);

    res.send(200);
});

pitAPIRouter.post("/removeChecklistItem", async (req, res) => {
    const body = z.object({ item: z.string() }).safeParse(req.body);
    if (!body.success) { res.send(400); return; }

    let current = await getSettingsValue("pitChecklist");
    current = current.filter(i => i !== body.data.item);
    await setSettingsValue("pitChecklist", current);

    res.send(200);
});