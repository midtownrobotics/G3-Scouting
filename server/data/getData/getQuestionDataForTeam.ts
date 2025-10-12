import { QuestionData, QuestionMetadata } from "@shared/schemas/data";
import FormModel from "../../models/forms/FormModel";
import { aggregateResponse, AggregationEntry, computeAverage } from "./getQuestionDataUtils";

export default async function getQuestionDataForTeam(team: number, minAccuracy?: number): Promise<QuestionData[] | null> {
    const allForms = await FormModel.getForms(true);
    const metadataMap = new Map<string, QuestionMetadata>();
    const aggregation = new Map<string, AggregationEntry>();

    for (const form of allForms) {
        const formData = form.getResponseData(minAccuracy);
        if (!formData) continue;

        for (const q of formData.questions) {
            if (q.classification !== "quantitative") continue;
            metadataMap.set(q.namespaceId, q);
        }

        for (const formResponse of formData.responses) {
            if (formResponse.team !== team) continue;

            for (const { question, response } of formResponse.responses) {
                aggregateResponse(aggregation, metadataMap, `${formResponse.formId}-${question}`, response, formResponse.userId ?? -1, formResponse.match);
            }
        }
    }

    const questionData: QuestionData[] = [];
    for (const [key, data] of aggregation.entries()) {
        const metadata = metadataMap.get(key);
        if (!metadata) continue;
        questionData.push({
            metadata,
            average: computeAverage(metadata, data),
            responses: data.responses,
        });
    }

    return questionData;
}
