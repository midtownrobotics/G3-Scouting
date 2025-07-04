import express, { Request, Response } from 'express';
import z from 'zod';
import FormModel from '../models/forms/FormModel';

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

export default formAPIRouter;