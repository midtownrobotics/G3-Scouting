import { FormResponseData } from "@shared/schemas/data";
import { getValueByPath } from "../../externalApis/tba/getValueByPath";
import { getMatchData } from "../../externalApis/tba/tba";
import FormResponseByTeamModel from "../../models/forms/FormResponseModels";
import { keepTryingQuery } from "../../models/modelUtils";
import AccuracyScoreModel from "../../models/validation/AccuracyScoreModel";
import ScoutAccuracyScoreModel from "../../models/validation/ScoutAccuracyScoreModel";

export default async function scoreAllianceData(
    match: number,
    alliance: "red" | "blue",
    formData: FormResponseData
): Promise<number | false> {
    const currentModel = await keepTryingQuery(() => AccuracyScoreModel.findOne({ where: { match, alliance } }));
    if (currentModel !== null && currentModel.score !== null) return currentModel.score;

    const matchTbaData = await getMatchData(match);
    if (!matchTbaData) return false;
    if (matchTbaData.actual_time === undefined) return false;

    const alliances = {
        blue: matchTbaData.alliances.blue.team_keys.map(t => parseInt(t.slice(3))),
        red: matchTbaData.alliances.red.team_keys.map(t => parseInt(t.slice(3)))
    };

    const matchData = formData.responses.filter(r =>
        r.match === match &&
        alliances[alliance].includes(r.team)
    );
    const teams = new Set(matchData.map(r => r.team));
    const users = new Set(matchData.map(r => r.userId));

    if (teams.size !== 3) return false;

    let totalAccuracy = 0;
    let scoredQuestions = 0;
    for (const question of formData.questions) {
        if (!("validation" in question) || question.validation === null) continue;

        const realValue = question.validation.type === "tba"
            ? getValueByPath(matchTbaData, question.validation.path, alliance)
            : undefined;
        if (realValue === undefined) continue;

        let totalValue = 0;
        for (const team of teams) {
            const teamData = matchData.filter(r => r.team === team);
            let teamValue = 0;
            for (const response of teamData) {
                const value = response.responses.find(r => r.question === question.id)?.response;
                teamValue += parseInt(value ?? "0");
            }
            totalValue += teamValue / teamData.length;
        }

        totalAccuracy += totalValue / realValue;
        scoredQuestions++;
    }

    const score = +(totalAccuracy / scoredQuestions).toFixed(2);

    const [model, created] = await keepTryingQuery(() => AccuracyScoreModel.findOrCreate({
        where: { match, alliance },
        defaults: { score }
    }));

    if (!created) {
        model.score = score;
        await keepTryingQuery(() => model.save());
    }

    for (const userId of users) {
        if (userId === undefined) continue;
        await keepTryingQuery(() => ScoutAccuracyScoreModel.findOrCreate({
            where: {
                userId: userId,
                accuracyScoreId: model.id
            }
        }));
    };

    for (const response of matchData) {
        const responseModel = await FormResponseByTeamModel.findByPk(response.id);
        responseModel?.update({ accuracyScore: score });
    };

    return score;
}