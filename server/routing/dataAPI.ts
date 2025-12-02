import { FormResponseData, MatchData, MiscTeamData, MultiTeamQuestionData, QuestionData } from "@shared/schemas/data";
import express from 'express';
import getMatchData from "server/data/getData/getMatchData";
import getMiscTeamData from "server/data/getData/getMiscTeamData";
import { getAllTeams } from "server/externalApis/tba/tba";
import getAllQuestionData from "../data/getData/getAllQuestionData";
import getQuestionDataForAllTeams from '../data/getData/getQuestionDataForAllTeams';
import getQuestionDataForTeam from '../data/getData/getQuestionDataForTeam';
import { getMatchRows, getTeamRows } from '../data/getData/getSpecificRows';
import FormModel from '../models/forms/FormModel';
import { numberParser } from "../utils";
import { z } from "zod";

const dataApiRouter = express.Router();

/** 
 * Gets all teams! 
 * {@link TbaTeamSimpleData[]} 
 */
dataApiRouter.get("/getAllTeams", async (req, res) => {
    const data = await getAllTeams();
    if (!data) { res.sendStatus(400); return; }
    res.send(data.map(t => ({number: t.team_number, name: t.nickname})));
});

/** 
 * Gets the form response data for one form. 
 * {@link FormResponseData[]} 
 */
dataApiRouter.get("/getFormData/:formId{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = (await FormModel.getForm(req.params.formId, true))?.getResponseData(numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

/** 
 * Gets the form response data for all forms where responses are about a certain team. 
 * {@link FormResponseData[]} 
 */
dataApiRouter.get("/getTeamRows/:teamNumber{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = await getTeamRows(parseInt(req.params.teamNumber), numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets the form response data for all forms where responses are about a certain match. 
 * {@link FormResponseData[]} 
 */
dataApiRouter.get("/getMatchRows/:teamNumber{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = await getMatchRows(parseInt(req.params.teamNumber), numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets data about each question as it pertains to a certain team.
 * {@link QuestionData[]} 
 */
dataApiRouter.get("/getTeamData/:teamNumber{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = await getQuestionDataForTeam(parseInt(req.params.teamNumber), numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets the question data as it pertains to each team, and overall, for a single form.
 * {@link MultiTeamQuestionData[]} 
 */
dataApiRouter.get("/getQuestionData/:formId{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = await getQuestionDataForAllTeams(req.params.formId, numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets the question data as it pertains to each team, and overall, for all forms.
 * {@link MultiTeamQuestionData[]} 
 */
dataApiRouter.get("/getAllQuestionData{/:maxError}{/:fromMatch}", async (req, res) => {
    const data = await getAllQuestionData(numberParser(req.params.maxError), numberParser(req.params.fromMatch));
    if (!data) { res.sendStatus(400); return; }
    res.send({ data });
});

/** 
 * Gets general stats about a team.
 * {@link MiscTeamData} 
 */
dataApiRouter.get("/getMiscTeamData/:team", async (req, res) => {
    const data = await getMiscTeamData(parseInt(req.params.team));
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

/** 
 * Gets match data.
 * {@link MatchData} 
 */
dataApiRouter.get("/getMatchData/:match", async (req, res) => {
    const data = await getMatchData(parseInt(req.params.match));
    if (!data) { res.sendStatus(400); return; }
    res.send({ ...data });
});

dataApiRouter.post("/ranking/parallel/setPersonal", async (req, res) => {
    const body = z.array(z.number().nullish()).safeParse(req.body);
    if (body.success) console.log(body.data);
});

export default dataApiRouter;