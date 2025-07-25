import { MultiTeamQuestionData, QuestionData, QuestionMetadata } from "@shared/schemas/data";
import FormModel from "../../models/forms/FormModel";
import { aggregateResponse, AggregationEntry, computeAverage } from "./getQuestionDataUtils";

export default async function getQuestionDataForAllTeams(formId: string, minAccuracy?: number): Promise<MultiTeamQuestionData[] | null> {
    const formData = (await FormModel.getForm(formId, true))?.getResponseData(minAccuracy);
    if (!formData) return null;

    const metadataMap = new Map<string, QuestionMetadata>();
    for (const q of formData.questions) {
        if (q.classification !== "quantitative") continue;
        metadataMap.set(q.namespaceId, q);
    }

    // Team : Question NamespaceId : AggregationEntry
    const teamMap = new Map<number, Map<string, AggregationEntry>>();

    for (const formResponse of formData.responses) {
        const team = formResponse.team;
        if (!teamMap.has(team)) teamMap.set(team, new Map());

        const teamAgg = teamMap.get(team)!;
        for (const { question, response } of formResponse.responses) {
            aggregateResponse(teamAgg, metadataMap, `${formResponse.formId}-${question}`, response, formResponse.match);
        }
    }

    const questionData: MultiTeamQuestionData[] = [];

    Array.from(metadataMap.values()).forEach((q, i) => {
        questionData.push({
            metadata: q,
            teamData: []
        });
    });

    for (const [team, agg] of teamMap.entries()) {
        for (const [key, entry] of agg.entries()) {
            const metadata = metadataMap.get(key);
            if (!metadata) continue;
            const data: QuestionData = {
                metadata,
                average: computeAverage(metadata, entry),
                responses: entry.responses,
            };
            questionData
                .find(q => q.metadata.namespaceId == metadata.namespaceId)
                ?.teamData.push({
                    questionData: data,
                    team
                });
        }
    }

    for (const q of questionData) {
        if (q.metadata.classification !== "quantitative" && q.metadata.type !== "number") continue;
        let maxAverage: typeof q.maxAverage;
        const total = q.teamData.reduce((acc, v) => {
            const average = v.questionData.average;
            if (typeof average === "number") {
                if (!maxAverage || average > maxAverage.average) {
                    maxAverage = { average, team: v.team };
                };
                return acc + average;
            }
            return acc;
        }, 0);
        const average = total / q.teamData.length;
        q.totalAverage = isFinite(average) ? average : 0;
        q.maxAverage = maxAverage;
    }

    return questionData;
}
