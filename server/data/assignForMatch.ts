import { CurrentAssignment } from "@shared/schemas/data";
import { AssignmentType } from "@shared/schemas/schedule";
import { getAllMatches } from "../externalApis/tba/tba";
import UserModel from "../models/users/UserModel";
import { setSettingsValue } from "../settings";
import { scoreAllForms } from "./reliability/scoreUnscoredMatches";
import { Alliance } from "@shared/forms/FormUtils";

export const currentAssignments: CurrentAssignment[] = [];

export default async function assignForMatch(nextMatch: number) {
    const match = (await getAllMatches())?.find(m => m.match_number === nextMatch);
    if (!match) return;
    const redTeams = match.alliances.red.team_keys.map(t => parseInt(t.slice(3)));
    const blueTeams = match.alliances.blue.team_keys.map(t => parseInt(t.slice(3)));
    const allTeams = redTeams.concat(blueTeams);
    if (allTeams.length !== 6) return;

    currentAssignments.length = 0;

    const users = await UserModel.findAll();
    for (const alliance of [Alliance.RED, Alliance.BLUE]) {
        const assigned: CurrentAssignment[] = [];
        const allianceTeams = alliance === Alliance.RED ? redTeams : blueTeams;

        for (const user of users) {
            if ((await user.getCurrentAssignment())?.type !== AssignmentType.ASSIGNED) continue;
            const i = assigned.length;
            const userAlliance = user.redAlliance ? Alliance.RED : Alliance.BLUE;
            if (userAlliance !== alliance) continue;    
            const team = allianceTeams[i % 3];
            
            currentAssignments.push({
                username: user.username,
                userId: user.id,
                team,
                teams: allianceTeams
            });
    
            await user.update({
                assignedMatches: [...user.assignedMatches, nextMatch],
                nextMatch: {
                    number: nextMatch,
                    team,
                    teams: allianceTeams
                }
            });
        }

        currentAssignments.push(...assigned)
    }

    setSettingsValue("match", {
        number: nextMatch,
        teams: allTeams,
        red: redTeams,
        blue: blueTeams
    });

    // Runs in background
    scoreAllForms();
}
