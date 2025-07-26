import { AssignmentType } from "@shared/schemas/schedule";
import AssignmentModel from "../models/scheduling/AssignmentModel";
import UserBlockAssignmentModel from "../models/scheduling/UserBlockAssignmentModel";
import { getSettings, writeSettings } from "../storage";
import { scoreAllForms } from "./reliability/scoreUnscoredMatches";
import { getCurrentBlockId } from "../scheduling/timeUtils";
import UserModel from "../models/users/UserModel";
import { TbaMatchData } from "../externalApis/tba/types";
import { getAllMatches } from "../externalApis/tba/tba";

export async function assignForNextMatch() {
    const settings = await getSettings();
    const currentMatch = settings.match;
    const nextMatch = currentMatch + 1;

    const match = (await getAllMatches())?.find(m => m.match_number === nextMatch);
    if (!match) return;
    const teams = [...match.alliances.red.team_keys, ...match.alliances.blue.team_keys].map(t => parseInt(t.slice(3)));
    if (teams.length !== 6) return;

    const users = await UserModel.findAll();
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if ((await user.getCurrentAssignment())?.type === AssignmentType.BREAK) {
            await user.update({
                assignedMatches: [...user.assignedMatches, nextMatch],
                nextMatch: {
                    number: nextMatch,
                    team: teams[i % 6]
                }
            });
        }
    }

    await writeSettings({ ...settings, match: nextMatch });
    await scoreAllForms();
}
