import { FormResponseData } from "@shared/schemas/data";
import { TbaMatchData } from "server/externalApis/tba/types";
import getTokensFromAccuracy from "server/game/getTokensFromAccuracy";
import UserModel from "server/models/users/UserModel";
import { numberParser } from "server/utils";
import { getValueByPath } from "../../externalApis/tba/getValueByPath";
import FormResponseByTeamModel from "../../models/forms/FormResponseModels";
import { keepTryingQuery } from "../../models/modelUtils";
import AccuracyScoreModel from "../../models/validation/AccuracyScoreModel";
import ScoutAccuracyScoreModel from "../../models/validation/ScoutAccuracyScoreModel";

export default async function scoreAllianceData(
    matchTbaData: TbaMatchData,
    alliance: "red" | "blue",
    formData: FormResponseData
): Promise<number | false> {
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
                teamValue += numberParser(value) ?? 0;
            }
            if (teamData.length > 0) {
                totalValue += teamValue / teamData.length;
            }
        }

        const error = Math.abs(totalValue - realValue) / realValue;
        const toAdd = 1 - error;

        if (!isNaN(toAdd) && isFinite(toAdd)) {
            totalAccuracy += toAdd;
            scoredQuestions++;
        }
    }
    
    const score = scoredQuestions > 0 ? Math.round(totalAccuracy / scoredQuestions * 10000) / 100 : 0;

    // console.log(match, score);

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

        const user = await UserModel.findByPk(userId);
        if (user) user.update({tokens: (user.tokens + getTokensFromAccuracy(score))});

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