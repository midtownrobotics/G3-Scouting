import express, { Request, Response } from 'express';
import z from 'zod';
import FormModel from '../models/forms/FormModel';
import { AuthReq } from '../types';
import { SerializedResponse } from '@shared/schemas/forms';
import FormResponseModel from '../models/forms/FormResponseModel';

const formAPIRouter = express.Router();

formAPIRouter.get("/getForms", async (req, res) => {
    res.send(await FormModel.getSerializedForms()) 
})

formAPIRouter.get("/getForm/:formId", async (req, res) => {
    const formId = req.params.formId;
    const form = await FormModel.getSerializedForm(formId);

    if (form) { 
        res.send(form); 
    } else { 
        res.sendStatus(400); 
    }
})

formAPIRouter.post("/submitForm", async (req: AuthReq, res) => { 
    const body = z.object({
        response: SerializedResponse,
        form: z.string()
    }).safeParse(req.body)

    if (req.user && body.success && body.data) {
        await FormResponseModel.submitResponse(body.data.response, body.data.form, req.user.id)

        res.sendStatus(200);
        return
    }
    res.sendStatus(400);
})

export default formAPIRouter;