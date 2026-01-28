import { FormResponse, SubmittedResponse } from '@shared/schemas/data';
import express from 'express';
import FormModel from '../models/forms/FormModel';
import FormResponseByTeamModel from '../models/forms/FormResponseModels';
import { AuthReq } from '../types';
import { number } from 'zod';

const formAPIRouter = express.Router();

formAPIRouter.get("/getForms", async (req, res) => {
    res.send(await FormModel.getSerializedForms());
});

formAPIRouter.get("/getForm/:formId", async (req, res) => {
    const formId = req.params.formId;
    const form = await FormModel.getSerializedForm(formId);

    if (form) {
        res.send(form);
    } else {
        res.sendStatus(400);
    }
});

formAPIRouter.post("/submitForm", async (req: AuthReq, res) => {
    const body = SubmittedResponse.safeParse(req.body);

    console.log(req.body);
    // console.log(body.error);

    if (req.user && body.success && body.data) {
        const { formId } = body.data;
        const form = await FormModel.getForm(formId);

        if (form === undefined || !form.deployed) { res.sendStatus(400); return; }

        await FormResponseByTeamModel.submitResponse(body.data, req.user);

        if ((req.user.nextMatch != undefined) && (
            (
                "response" in body.data && req.user.nextMatch?.number === body.data.response.match
            ) || (
                "responses" in body.data && req.user.nextMatch?.number === body.data.responses[0].match
            )
        )) {
            req.user.update({
                nextMatch: { ...req.user.nextMatch, finished: true }
            })
        }

        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

export default formAPIRouter;