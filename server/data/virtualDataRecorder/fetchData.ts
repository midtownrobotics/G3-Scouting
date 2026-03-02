import { Data, DataType } from "@shared/schemas/virtualDataRecorder";
import getQuestionDataForTeam from "../getData/getQuestionDataForTeam";
import * as statbotics from "server/externalApis/statbotics/statbotics";
import * as tba from "server/externalApis/tba/tba";
import { getValueByPath } from "server/externalApis/getValueByPath";
import { SbMatchData } from "server/externalApis/statbotics/types";

/**
 * Fetches data for use in the virtual data recording system.
 * @param data The data object containing the fetch type and the path to the data.
 * @param team The team to fetch the data for.
 * @param match The match to fetch the data for.
 * @returns A `number` or `undefined` if the data could not be fetched.
 */
export default async function (data: Data, team?: number, match?: number) {
    switch (data.type) {
        case DataType.SOM_MATCH_TEAM:
            if (!match || !team) return;
            return fetchSomMatchTeamData(data.path, team, match);
        case DataType.SOM_TEAM_AVG:
            if (!team) return;
            return fetchSomMatchTeamAvgData(data.path, team);
        case DataType.STATBOTICS_MATCH:
            if (!team) return;
            return fetchStatboticsMatchData(data.path, team);
        case DataType.STATBOTICS_TEAM:
            if (!team) return;
            return fetchStatboticsTeamData(data.path, team);
        case DataType.TBA_MATCH:
            if (!match) return;
            return fetchTbaMatchData(data.path, match);
        case DataType.TBA_TEAM:
            if (!team) return;
            return fetchTbaTeamData(data.path, team);
    }
}

async function fetchSomMatchTeamData(namespaceId: string, team: number, match: number) {
    const allData = await getQuestionDataForTeam(team);
    if (!allData) return;
    const questionData = allData.find(q => q.metadata.namespaceId === namespaceId);
    if (!questionData || questionData.metadata.type !== "number") return;
    const responses = questionData.responses.filter(r => r.match === match);
    if (!responses) return;
    let answer = responses.reduceRight((p, c) => p + (parseInt(c.response) || 0), 0);
    answer /= responses.length;
    answer == answer || 0;
    return answer;
}

async function fetchSomMatchTeamAvgData(namespaceId: string, team: number) {
    const allData = await getQuestionDataForTeam(team);
    if (!allData) return;
    const questionData = allData.find(q => q.metadata.namespaceId === namespaceId);
    if (!questionData || questionData.metadata.type !== "number") return;
    const { average } = questionData;
    if (typeof average === "number") return average;
}

async function fetchStatboticsMatchData(path: string, match: number) {
    const sbData = await statbotics.getMatchData(match);
    if (!sbData) return;
    return getValueByPath(sbData, path);
}

async function fetchStatboticsTeamData(path: string, team: number) {
    const sbData = await statbotics.getTeamData(team);
    if (!sbData) return;
    return getValueByPath(sbData, path);
}

async function fetchTbaMatchData(path: string, team: number) {
    const tbaData = await tba.getMatchData(team);
    if (!tbaData) return;
    return getValueByPath(tbaData, path);
}

async function fetchTbaTeamData(path: string, team: number) {
    const tbaData = await tba.getTeamData(team);
    if (!tbaData) return;
    return getValueByPath(tbaData, path);
}