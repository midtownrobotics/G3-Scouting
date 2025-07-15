import { FieldResponse, FormQuestionMeta, FormRowResponse, RowData } from "@shared/schemas/data";
import getFormRows from "./getFormRows";
import { isAverageable } from "./utils";

export default async function getAverageForAllTeams(formId: string): Promise<FormRowResponse | null> {
    const data = (await getFormRows(formId));
    if (!data) return null;
    const { rows } = data;
    const teamMap = new Map<number, Map<string, { sum: number; count: number; } | { values: Map<string, number>; }>>();

    for (const row of rows) {
        const { teamNumber, fieldResponses } = row;
        if (!teamMap.has(teamNumber)) {
            teamMap.set(teamNumber, new Map());
        }

        const questionMap = teamMap.get(teamNumber)!;

        for (const { question, response } of fieldResponses) {
            const questionData = data.questions.find(q => q.id == question);
            if (!isAverageable(questionData)) continue;

            if (questionData?.type == "string") {
                const current = questionMap.get(question) || { values: new Map<string, number>() };
                if ("values" in current) {
                    const count = current.values.get(response);
                    current.values.set(response, count ? count + 1 : 1);
                    questionMap.set(question, current);
                }
                continue;
            }

            const value = parseFloat(response);
            if (isNaN(value)) continue;
            const current = questionMap.get(question) || { sum: 0, count: 0 };
            if ("sum" in current) {
                current.sum += value;
                current.count += 1;
                questionMap.set(question, current);
            }
        }
    }

    const result: RowData[] = [];

    for (const [team, questions] of teamMap.entries()) {
        const fieldResponses: FieldResponse[] = [];
        for (const [question, data] of questions.entries()) {
            if ("sum" in data) {
                fieldResponses.push({
                    question,
                    response: (Math.round(data.sum / data.count * 100) / 100).toString()
                });
                continue;
            }

            const map = Array.from(data.values.entries());
            const mostCommon = map.sort((a, b) => b[1] - a[1])[0];
            const total = map.reduce((a, c) => a + c[1], 0)

            fieldResponses.push({
                question,
                response: `${mostCommon[0]} - ${Math.round(mostCommon[1]/total*100)}%`
            });
        }
        result.push({
            fieldResponses,
            teamNumber: team,
            matchNumber: 0
        });
    }

    return {
        rows: result,
        questions: data.questions.filter(q => isAverageable(q))
    };
}
