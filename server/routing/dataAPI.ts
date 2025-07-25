import { FormResponseData, QuestionData, MultiTeamQuestionData } from "@shared/schemas/data";
import express from 'express';
import getQuestionDataForAllTeams from '../data/getData/getQuestionDataForAllTeams';
import getQuestionDataForTeam from '../data/getData/getQuestionDataForTeam';
import getTeamRows from '../data/getData/getTeamRows';
import FormModel from '../models/forms/FormModel';
import getAllQuestionData from "../data/getData/getAllQuestionData";
import { numberParser } from "../utils";

const dataApiRouter = express.Router();

/** 
 * Gets the form response data for one form. 
 * {@link FormResponseData} 
 */
dataApiRouter.get("/getFormData/:formId{/:minAccuracy}", async (req, res) => {
    const data = (await FormModel.getForm(req.params.formId, true))?.getResponseData(numberParser(req.params.minAccuracy));
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

/** 
 * Gets the form response data for all forms where responses are about a certain team. 
 * {@link FormResponseData[]} 
 */
dataApiRouter.get("/getTeamRows/:teamNumber{/:minAccuracy}", async (req, res) => {
    const data = await getTeamRows(parseInt(req.params.teamNumber), numberParser(req.params.minAccuracy));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets data about each question as it pertains to a certain team.
 * {@link QuestionData} 
 */
dataApiRouter.get("/getTeamData/:teamNumber{/:minAccuracy}", async (req, res) => {
    const data = await getQuestionDataForTeam(parseInt(req.params.teamNumber), numberParser(req.params.minAccuracy));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets the question data as it pertains to each team, and overall, for a single form.
 * {@link MultiTeamQuestionData[]} 
 */
dataApiRouter.get("/getQuestionData/:formId{/:minAccuracy}", async (req, res) => {
    const data = await getQuestionDataForAllTeams(req.params.formId, numberParser(req.params.minAccuracy));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets the question data as it pertains to each team, and overall, for all forms.
 * {@link MultiTeamQuestionData[]} 
 */
dataApiRouter.get("/getAllQuestionData{/:minAccuracy}", async (req, res) => {
    const data = await getAllQuestionData(numberParser(req.params.minAccuracy));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

export default dataApiRouter;