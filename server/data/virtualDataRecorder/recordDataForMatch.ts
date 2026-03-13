import VirtualDataEquationModel from "server/models/forms/VirtualDataEquationModels";
import { evaluateEquation } from "./evaluateEquation";
import FormResponseByTeamModel from "server/models/forms/FormResponseModels";
import getMatchData from "../getData/getMatchData";
import { equationNeedsCalculateOtf } from "./vdrUtils";
import * as statbotics from "server/externalApis/statbotics/statbotics";

type err = "noStatboticsData" | "noTbaData";

export default async function (matchNumber: number): Promise<{ success: true } | { success: false, err: err }> {
    const matchData = await getMatchData(matchNumber);

    if (!matchData || !matchData.posted) return { err: "noTbaData", success: false };
    if (!statbotics.hasMatchHappened(await statbotics.getMatchData(matchNumber))) return { err: "noStatboticsData", success: false };

    const equations = await VirtualDataEquationModel.findAll();

    for (const team of matchData.teams) {
        const equationResults: { id: string, value: number | undefined }[] = [];

        for (const equation of equations) {
            if (equationNeedsCalculateOtf(equation.equation)) continue;
            const value = await evaluateEquation(equation.equation, team, matchData.number);
            equationResults.push({ id: equation.id, value: value?.value });
        }

        FormResponseByTeamModel.submitVirtualResponse({
            team,
            responses: equationResults.map(({ id, value }) => ({ question: id, response: (value ?? "").toString() })),
            formId: "VDR"
        })
    }

    return { success: true }
}