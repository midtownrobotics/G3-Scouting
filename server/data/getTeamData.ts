import { QuestionData } from "@shared/schemas/data";
import getTeamAverages from "./getTeamAverages";
import getTeamRows from "./getTeamRows";

export default async function getTeamData(team: number) {
    const teamAverages = await getTeamAverages(team);
    const teamRows = await getTeamRows(team);

    let questionData: QuestionData[] = [];

    teamRows.forEach((f) => {
        const questionMap = new Map<string, QuestionData>();

        f.responses.rows.forEach(r => {
            r.fieldResponses.forEach(fr => {
                if (!questionMap.has(fr.question)) {
                    const questionMeta = f.responses.questions.find(q => q.id == fr.question);
                    if (questionMeta !== undefined) {
                        const questionFormId = `${f.form}:${fr.question}`;
                        questionMap.set(fr.question, {
                            questionMeta,
                            questionId: fr.question,
                            questionFormId,
                            average: teamAverages?.rows[0].fieldResponses.find(afr => afr.question == questionFormId)?.response,
                            responses: []
                        });
                    }
                }

                const question = questionMap.get(fr.question);
                question?.responses.push({
                    matchNumber: r.matchNumber,
                    response: fr.response
                });
            });
        });

        questionData = [ ...Array.from(questionMap.values()), ...questionData ]
    });

    return questionData;
}