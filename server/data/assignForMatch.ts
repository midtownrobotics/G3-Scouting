import { AssignmentType } from "@shared/schemas/schedule";
import { getAllMatches } from "../externalApis/tba/tba";
import UserModel from "../models/users/UserModel";
import { getSettings, writeSettings } from "../storage";
import { scoreAllForms } from "./reliability/scoreUnscoredMatches";
import { z } from "zod";
import { CurrentAssignment } from "@shared/schemas/data";

export const currentAssignments: CurrentAssignment[] = [];

export default async function assignForMatch(nextMatch: number) {
    const match = (await getAllMatches())?.find(m => m.match_number === nextMatch);
    if (!match) return;
    const teams = [...match.alliances.red.team_keys, ...match.alliances.blue.team_keys].map(t => parseInt(t.slice(3)));
    if (teams.length !== 6) return;

    currentAssignments.length = 0;

    const users = await UserModel.findAll();
    for (const user of users) {
        if ((await user.getCurrentAssignment())?.type !== AssignmentType.SCOUTING) continue;

        const team = teams[currentAssignments.length % 6];
        currentAssignments.push({
            username: user.username,
            userId: user.id,
            team
        });

        await user.update({
            assignedMatches: [...user.assignedMatches, nextMatch],
            nextMatch: {
                number: nextMatch,
                team
            }
        });
    }

    const settings = await getSettings();
    await writeSettings({ ...settings, match: nextMatch });

    await scoreAllForms();
}
