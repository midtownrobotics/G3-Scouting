import { MultiTeamQuestionData } from "@shared/schemas/data";
import FormModel from "../../models/forms/FormModel";
import getQuestionDataForAllTeams from "./getQuestionDataForAllTeams";

export default async function getAllQuestionData(maxError?: number, fromMatch?: number) {
    const forms = await FormModel.getSerializedForms();
    const questionData: MultiTeamQuestionData[] = [];

    for (const form of forms) {
        const data = await getQuestionDataForAllTeams(form.id, maxError, fromMatch);
        if (data) questionData.push(...data);
    }

    return questionData;
}