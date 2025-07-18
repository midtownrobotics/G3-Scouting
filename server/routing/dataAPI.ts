import express from 'express';
import getAverageForAllTeams from '../data/getQuestionDataForAllTeams';
import getFormRows from '../data/getFormRows';
import getTeamData from '../data/getQuestionDataForTeam';
import getTeamRows from '../data/getTeamRows';

const dataApiRouter = express.Router();

dataApiRouter.get("/getFormRows/:formId", async (req, res) => {
    const rows = await getFormRows(req.params.formId);
    if (!rows) { res.sendStatus(400); return; }
    res.send({ ...rows });
});

dataApiRouter.get("/getTeamRows/:teamNumber", async (req, res) => {
    const data = await getTeamRows(parseInt(req.params.teamNumber));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

dataApiRouter.get("/getAggregatedRows/:formId", async (req, res) => {
    const data = await getAverageForAllTeams(req.params.formId);
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

dataApiRouter.get("/getTeamData/:teamNumber", async (req, res) => {
    const data = await getTeamData(parseInt(req.params.teamNumber));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

export default dataApiRouter;