import { FormQuestionMeta } from "@shared/schemas/data";

export const isAverageable = (q?: FormQuestionMeta, excludeTeamNumber?: boolean) => (
    q?.classification === "quantitative" ||
    ( !excludeTeamNumber && q?.classification === "teamNumber")
);