import { FormResponseData } from "@shared/schemas/data";
import { TbaMatchData } from "server/externalApis/tba/types";
import { numberParser } from "server/utils";
import { getValueByPath } from "../../externalApis/tba/getValueByPath";
import FormResponseByTeamModel from "../../models/forms/FormResponseModels";

export default async function scoreAllianceData(
    matchTbaData: TbaMatchData,
    alliance: "red" | "blue",
    formData: FormResponseData
) {
    const match = matchTbaData.match_number;

    // const currentModel = await keepTryingQuery(() => AccuracyScoreModel.findOne({ where: { match, alliance } }));
    // if (currentModel !== null && currentModel.score !== null) return currentModel.score;

    const alliances = {
        blue: matchTbaData.alliances.blue.team_keys.map(t => parseInt(t.slice(3))),
        red: matchTbaData.alliances.red.team_keys.map(t => parseInt(t.slice(3)))
    };

    const matchData = formData.responses.filter(r =>
        r.match === match &&
        alliances[alliance].includes(r.team)
    );
    const teams = new Set(matchData.map(r => r.team));
    const users = matchData.filter(r => r.userId !== undefined).map(r => ({ id: r.userId!, response: r }));
    const userScores = new Map(users.map(u => [u.id, 0]));

    if (teams.size !== 3) return 1;

    for (const question of formData.questions) {
        if (!("validation" in question) || question.validation === null) continue;

        const realValue = question.validation.type === "tba"
            ? getValueByPath(matchTbaData, question.validation.path, alliance)
            : undefined;
        if (realValue === undefined) continue;

        const userTeams: { team: number, users: { id: number, response: typeof matchData[0] }[] }[] = [];

        for (const team of teams) {
            const teamData = matchData.filter(r => r.team === team && r.userId);
            userTeams.push({ team, users: teamData.map(r => ({ id: r.userId!, response: r })) });
        }

        for (const user of users) {
            const otherTeams = userTeams.filter(t => t.team !== user.response.team);
            let combinationError = 0;
            let calcCount = 0;
            for (let i = 0; i < otherTeams[0].users.length; i++) {
                for (let j = 0; j < otherTeams[1].users.length; j++) {
                    const allUserData = [user, otherTeams[0].users[i], otherTeams[1].users[j]];
                    const theoreticalValue = allUserData.reduce((pv, cv) => {
                        const response = cv.response.responses.find(r => r.question === question.id)
                        const value = numberParser(response?.response);
                        return value ? pv + value : pv;
                    }, 0);

                    const rawError = Math.abs(theoreticalValue - realValue) / Math.max(Math.abs(realValue), 3);
                    const error = Math.min(rawError, 1); // max 100% error

                    combinationError += error;
                    calcCount++;
                }
            }
            const averageCombinationError = calcCount > 0 ? Math.round(combinationError / calcCount * 100) : 0;
            userScores.set(user.id, userScores.get(user.id)! + averageCombinationError);
        }
    }

    for (const response of matchData) {
        if (!response.userId) continue;
        const score = userScores.get(response.userId);
        if (score === undefined) continue
        const responseModel = await FormResponseByTeamModel.findByPk(response.id);
        responseModel?.update({ accuracyScore: score });
    };
}