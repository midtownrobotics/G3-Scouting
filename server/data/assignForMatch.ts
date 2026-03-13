import { CurrentAssignment, NextMatch } from "@shared/schemas/data";
import { AssignmentType } from "@shared/schemas/schedule";
import { getAllMatches } from "../externalApis/tba/tba";
import UserModel from "../models/users/UserModel";
import { getSettingsValue, setSettingsValue } from "../other/settings";
import { scoreAllForms } from "./reliability/scoreUnscoredMatches";
import { Alliance } from "@shared/utils";

export default async function assignForMatch(nextMatch: number) {
    const match = (await getAllMatches())?.find(m => m.match_number === nextMatch && m.comp_level == "qm");
    if (!match) return;
    const redTeams = match.alliances.red.team_keys.map(t => parseInt(t.slice(3)));
    const blueTeams = match.alliances.blue.team_keys.map(t => parseInt(t.slice(3)));
    const allTeams = redTeams.concat(blueTeams);
    // if (allTeams.length !== 6) return;

    const setNoNextMatch = (user: UserModel) => user.update({
        nextMatch: {
            number: nextMatch,
            finished: false
        }
    });

    const users = await UserModel.findAll();
    for (const alliance of [Alliance.RED, Alliance.BLUE]) {
        const assigned: CurrentAssignment[] = [];
        const allianceTeams = alliance === Alliance.RED ? redTeams : blueTeams;

        for (const user of users) {
            const currentAssignment = await user.getCurrentAssignment();
            if (currentAssignment?.type !== AssignmentType.ASSIGNED) { setNoNextMatch(user); continue; };;
            const i = assigned.length;
            const userAlliance = await user.getCurrentAlliance();
            if (userAlliance !== alliance) { setNoNextMatch(user); continue; };
            const team = allianceTeams[i % 3];

            const newAssignment: CurrentAssignment = {
                number: nextMatch,
                team,
                teams: allianceTeams,
                finished: false,
                username: user.username,
                userId: user.id,
                displayName: user.displayName,
                alliance: alliance,
            };

            await user.update({
                assignedMatches: [...user.assignedMatches, nextMatch],
                nextMatch: newAssignment
            });

            assigned.push(newAssignment);
        }
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

export async function getAllCurrentAssignmentStatuses(): Promise<CurrentAssignment[]> {
    const match = await getSettingsValue("match");
    const users = await UserModel.findAll();
    const assignments = users
        .filter(u => u.nextMatch != null && u.nextMatch.team !== undefined && u.nextMatch?.number === match.number)
        .map(u => ({
            ...u.nextMatch!,
            userId: u.id,
            username: u.username
        }));

    return assignments;
}