import { MultiTeamQuestionData, QuestionData, QuestionMetadata } from "@shared/schemas/data";
import FormModel from "../../models/forms/FormModel";
import { aggregateResponse, AggregationEntry, computeAverage } from "./getQuestionDataUtils";

const cache: Map<string, { data: MultiTeamQuestionData[], exp: number}> = new Map();

/**
 * Gets the question data for every team. This data is cached for 60 seconds because this call is somewhat intensive.
 */
export default async function getQuestionDataForAllTeams(formId: string, maxError?: number, fromMatch?: number, toMatch?: number): Promise<MultiTeamQuestionData[] | null> {
    const cached = cache.get(formId);
    if (cached && cached.exp > Date.now()) {
        return cached.data;
    }

    const formData = (await FormModel.getForm(formId, true))?.getResponseData(maxError, fromMatch, toMatch);
    if (!formData) return null;

    const metadataMap = new Map<string, QuestionMetadata>();
    for (const q of formData.questions) {
        metadataMap.set(q.namespaceId, q);
    }

    // Team : Question NamespaceId : AggregationEntry
    const teamMap = new Map<number, Map<string, AggregationEntry>>();

    for (const formResponse of formData.responses) {
        const team = formResponse.team;
        if (!teamMap.has(team)) teamMap.set(team, new Map());

        const teamAgg = teamMap.get(team)!;
        for (const { question, response } of formResponse.responses) {
            aggregateResponse(teamAgg, metadataMap, `${formResponse.formId}-${question}`, response, formResponse.userId ?? -1, formResponse.match);
        }
    }

    const questionData: MultiTeamQuestionData[] = [];

    Array.from(metadataMap.values()).forEach((q, i) => {
        questionData.push({
            metadata: q,
            teamData: [],
            stats: {}
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

    function percentile(sortedArr: number[], p: number): number {
        if (sortedArr.length === 0) return NaN;
        const index = (p / 100) * (sortedArr.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        if (upper >= sortedArr.length) return sortedArr[lower];
        return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
    }

    for (const q of questionData) {
        if (q.metadata.classification !== "quantitative" && q.metadata.type !== "number") continue;

        let maxAverage: typeof q.stats.maxAverage;
        const values: number[] = [];

        const total = q.teamData.reduce((acc, v) => {
            const average = v.questionData.average;
            if (typeof average === "number") {
                values.push(average);

                if (!maxAverage || average > maxAverage.average) {
                    maxAverage = { average, team: v.team };
                }
                return acc + average;
            }
            return acc;
        }, 0);

        const average = total / values.length;
        values.sort((a, b) => a - b);

        q.stats.totalAverage = isFinite(average) ? average : 0;
        q.stats.maxAverage = maxAverage;

        q.stats.percentile25 = percentile(values, 25);
        q.stats.percentile50 = percentile(values, 50);
        q.stats.percentile75 = percentile(values, 75);
    }

    cache.set(formId, { data: questionData, exp: Date.now() + 60000 });

    return questionData;
}
