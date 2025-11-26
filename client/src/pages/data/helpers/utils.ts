import { FormType } from "@shared/forms/Form";
import { FormResponseData, QuestionMetadata } from "@shared/schemas/data";

export const getTeamSummaryUrl = (team: number, accuracy: number = getAccuracy()) => `/?page=data&viewer=0&team=${team}&accuracy=${accuracy}`;
export const getMatchUrl = (match: number, accuracy: number = getAccuracy()) => `/?page=data&viewer=1&match=${match}&accuracy=${accuracy}`;

const getAccuracy = () => parseInt(new URLSearchParams(window.location.search).get("accuracy") ?? defaultAccuracy.toString());

export const isMatchRelated = (q: QuestionMetadata | FormResponseData) => q.formType !== FormType.NO_MATCH && q.formType !== FormType.SINGLE_TEAM_RESPONSE;

export const defaultAccuracy = 1000;