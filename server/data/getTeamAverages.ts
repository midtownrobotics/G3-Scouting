import { FieldResponse, FormQuestionMetaWithId, FormRowResponse } from "@shared/schemas/data";
import FormModel from "../models/forms/FormModel";
import { isAverageable } from "./utils";

type NamespacedQuestionKey = string; // e.g., "form123:q1"

export default async function getTeamAverages(team: number): Promise<FormRowResponse | null> {
    const allForms = await FormModel.getForms(true);

    const questionMap = new Map<NamespacedQuestionKey, FormQuestionMetaWithId & { form: string; }>();
    const aggregation = new Map<NamespacedQuestionKey, { sum: number; count: number; } | { values: Map<string, number>; }>();

    for (const form of allForms) {
        const formData = form.getResponseData();
        if (!formData) continue;

        const formId = form.id;

        // Store question info with namespaced keys
        for (const q of formData.questions) {
            if (!isAverageable(q, true)) continue;
            const namespacedId = `${formId}:${q.id}`;
            questionMap.set(namespacedId, { ...q, id: namespacedId, form: formId });
        }

        for (const row of formData.responses) {
            if (row.teamNumber !== team) continue;

            for (const { question, response } of row.fieldResponses) {
                const namespacedId = `${formId}:${question}`;
                const qData = questionMap.get(namespacedId);
                if (!qData) continue;

                if (qData.type === "string") {
                    const entry = aggregation.get(namespacedId) || { values: new Map<string, number>() };
                    if ("values" in entry) {
                        const count = entry.values.get(response) ?? 0;
                        entry.values.set(response, count + 1);
                        aggregation.set(namespacedId, entry);
                    }
                } else {
                    const value = parseFloat(response);
                    if (isNaN(value)) continue;
                    const entry = aggregation.get(namespacedId) || { sum: 0, count: 0 };
                    if ("sum" in entry) {
                        entry.sum += value;
                        entry.count += 1;
                        aggregation.set(namespacedId, entry);
                    }
                }
            }
        }
    }

    const fieldResponses: FieldResponse[] = [];

    for (const [key, data] of aggregation.entries()) {
        if ("sum" in data) {
            const avg = data.count === 0 ? 0 : data.sum / data.count;
            fieldResponses.push({
                question: key,
                response: (Math.round(avg * 100) / 100).toString()
            });
        } else {
            const values = Array.from(data.values.entries());
            const mostCommon = values.sort((a, b) => b[1] - a[1])[0];
            const total = values.reduce((sum, [, count]) => sum + count, 0);
            const percent = total ? Math.round((mostCommon[1] / total) * 100) : 0;

            fieldResponses.push({
                question: key,
                response: `${mostCommon[0]} - ${percent}%`
            });
        }
    }

    return {
        rows: [{
            teamNumber: team,
            matchNumber: 0,
            fieldResponses
        }],
        questions: Array.from(questionMap.values())
    };
}
