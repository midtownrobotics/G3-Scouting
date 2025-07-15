import { TeamRowsResponse } from "@shared/schemas/data";
import FormModel from "../models/forms/FormModel";
import getFormRows from "./getFormRows";

export default async function getTeamRows(team: number): Promise<TeamRowsResponse> {
    const data = await Promise.all(
        (await FormModel.getForms(true)).map(async (f) => ({
            form: f.name,
            responses: await getFormRows(f),
        }))
    );
    
    return data.map(f => ({ form: f.form, responses: { questions: f.responses.questions, rows: f.responses.rows.filter(r => r.teamNumber === team) } }))
}