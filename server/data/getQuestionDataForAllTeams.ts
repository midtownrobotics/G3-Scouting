import { QuestionData, QuestionMetadata, TeamQuestionData } from "@shared/schemas/data";
import FormModel from "../models/forms/FormModel";
import { aggregateResponse, AggregationEntry, computeAverage, namespacedId } from "./getQuestionDataUtils";

export default async function getQuestionDataForAllTeams(formId: string): Promise<TeamQuestionData[] | null> {
    const formData = (await FormModel.getForm(formId, true))?.getResponseData();
    if (!formData) return null;

    const metadataMap = new Map<string, QuestionMetadata>();
    for (const q of formData.questions) {
        if (q.classification !== "quantitative") continue;
        metadataMap.set(namespacedId(q.formId, q.id), q);
    }

    const teamMap = new Map<number, Map<string, AggregationEntry>>();

    for (const formResponse of formData.responses) {
        const team = formResponse.team;
        if (!teamMap.has(team)) teamMap.set(team, new Map());

        const teamAgg = teamMap.get(team)!;
        for (const { question, response } of formResponse.responses) {
            aggregateResponse(teamAgg, metadataMap, formResponse.formId, question, response, formResponse.match);
        }
    }

    const teamQuestionData: TeamQuestionData[] = [];

    for (const [team, agg] of teamMap.entries()) {
        const data: QuestionData[] = [];
        for (const [key, entry] of agg.entries()) {
            const metadata = metadataMap.get(key);
            if (!metadata) continue;
            data.push({
                metadata,
                average: computeAverage(metadata, entry),
                responses: entry.responses,
            });
        }
        teamQuestionData.push({ team, questionData: data });
    }

    return teamQuestionData;
}
