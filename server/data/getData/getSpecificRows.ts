import { FormResponseData } from "@shared/schemas/data";
import FormModel from "../../models/forms/FormModel";

export async function getTeamRows(team: number, minAccuracy?: number): Promise<FormResponseData[]> {
    const formDatas = (await Promise.all(
        (await FormModel.getForms(true)).map(f => f.getResponseData(minAccuracy))
    )).filter(formData => formData !== null);
    
    return formDatas.map(formData => ({...formData, responses: formData.responses.filter(d => d.team == team)}))
}

export async function getMatchRows(match: number, minAccuracy?: number): Promise<FormResponseData[]> {
    const formDatas = (await Promise.all(
        (await FormModel.getForms(true)).map(f => f.getResponseData(minAccuracy))
    )).filter(formData => formData !== null);
    
    return formDatas.map(formData => ({...formData, responses: formData.responses.filter(d => d.match == match)}))
}