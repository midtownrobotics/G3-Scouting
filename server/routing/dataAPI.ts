import { FormResponseData, TeamQuestionData } from "@shared/schemas/data";
import express from 'express';
import getQuestionDataForAllTeams from '../data/getQuestionDataForAllTeams';
import getQuestionDataForTeam from '../data/getQuestionDataForTeam';
import getTeamRows from '../data/getTeamRows';
import FormModel from '../models/forms/FormModel';

const dataApiRouter = express.Router();

/** {@link FormResponseData} */
dataApiRouter.get("/getFormData/:formId", async (req, res) => {
    const data = (await FormModel.getForm(req.params.formId))?.getResponseData();
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

/** {@link FormResponseData[]} */
dataApiRouter.get("/getTeamRows/:teamNumber", async (req, res) => {
    const data = await getTeamRows(parseInt(req.params.teamNumber));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** {@link TeamQuestionData} */
dataApiRouter.get("/getTeamData/:teamNumber", async (req, res) => {
    const data = await getQuestionDataForTeam(parseInt(req.params.teamNumber));
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

/** {@link TeamQuestionData[]} */
dataApiRouter.get("/getAveragedFormData/:formId", async (req, res) => {
    const data = await getQuestionDataForAllTeams(req.params.formId);
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

export default dataApiRouter;