import { MultiTeamQuestionData, QuestionResponse } from "@shared/schemas/data";
import FormModel from "../models/forms/FormModel";
import getQuestionDataForAllTeams from "./getQuestionDataForAllTeams";

export default async function getAllQuestionData() {
    const forms = await FormModel.getSerializedForms();
    const questionData: MultiTeamQuestionData[] = [];

    for (const form of forms) {
        const data = await getQuestionDataForAllTeams(form.id);
        if (data) questionData.push(...data);
    }

    return questionData;
}