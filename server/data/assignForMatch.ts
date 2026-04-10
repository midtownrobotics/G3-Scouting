import { CurrentAssignment, NextMatch } from "@shared/schemas/data";
import { AssignmentType } from "@shared/schemas/schedule";
import { getMatchData } from "../externalApis/tba/tba";
import UserModel from "../models/users/UserModel";
import { getSettingsValue, setSettingsValue } from "../other/settings";
import { scoreAllForms } from "./reliability/scoreUnscoredMatches";
import { Alliance } from "@shared/utils";
import * as CheckIn from "../scheduling/checkIn"

const warnings = new Set<number>();

/** 
 * Gives all users that are checked in or are currently assigned to be scouting a team and alliance to scout. 
 * @param nextMatch The match to assign teams for.
 */
export default async function assignForMatch(nextMatch: number) {
    // Gets all the users current assignments
    const currentAssignments = await getAllCurrentAssignmentStatuses();

    for (const user of currentAssignments) {
        // If the user is checked in and had an assignment but did not scout their match.
        if (CheckIn.isUserCheckedIn(user.userId) && !user.finished) {
            // Give the user a "warning" or last chance before checking them out
            if (!warnings.has(user.userId)) warnings.add(user.userId);
            // If they already have a warning, check them out
            else {
                CheckIn.checkOut(user.userId);
                warnings.delete(user.userId);
            }
        }
    }

    // Get match data from TBA
    const match = await getMatchData(nextMatch);
    if (!match) return;
    // Get list of red/blue/all teams (removing the TBA added `frc` prefix)
    const redTeams = match.alliances.red.team_keys.map(t => parseInt(t.slice(3)));
    const blueTeams = match.alliances.blue.team_keys.map(t => parseInt(t.slice(3)));
    const allTeams = redTeams.concat(blueTeams);

    // Helper function to set a user to not having an assignment
    const setNoNextMatch = (user: UserModel) => user.update({
        nextMatch: {
            number: nextMatch
        }
    });

    const users = (await UserModel.findAll())
        .sort((a, b) => {
            const aChecked = CheckIn.isUserCheckedIn(a.id);
            const bChecked = CheckIn.isUserCheckedIn(b.id);
            return aChecked === bChecked ? 0 : aChecked ? -1 : 1;
        });
    const assigned: CurrentAssignment[] = [];
    let redCount = 0;
    let blueCount = 0;

    for (const user of users) {
        // Users current assignment
        const currentAssignment = await user.getCurrentAssignment();
        // Is the user currently checked in
        const userCheckedIn = CheckIn.isUserCheckedIn(user.id);

        // If the user isn't checked in and they aren't assigned to be scouting, they should not get an assignment
        if (currentAssignment?.type !== AssignmentType.ASSIGNED && !userCheckedIn) {
            setNoNextMatch(user);
            continue;
        }

        // Give the user the least assigned alliance if they're checked in, otherwise give them their assigned alliance.
        const leastAssigned = redCount > blueCount ? Alliance.BLUE : Alliance.RED;
        let userAlliance = leastAssigned;
        if (!userCheckedIn) {
            const assigned = await user.getCurrentAlliance();
            userAlliance = assigned ?? leastAssigned;
        }

        const redAlliance = userAlliance === Alliance.RED;

        const teams = (redAlliance ? redTeams : blueTeams);
        const count = (redAlliance ? redCount : blueCount);

        if (redAlliance) redCount++; else blueCount++;

        // Give the user one of three teams depending on their index for their alliance 
        const team = teams[count % 3];

        // Creates the new assignment for this user
        const newAssignment: CurrentAssignment = {
            number: nextMatch,
            team,
            teams,
            finished: false,
            username: user.username,
            userId: user.id,
            displayName: user.displayName,
            alliance: userAlliance
        };

        await user.update({
            assignedMatches: [...user.assignedMatches, nextMatch],
            nextMatch: newAssignment
        });

        assigned.push(newAssignment);
    }

    // Set global information about the next match
    setSettingsValue("match", {
        number: nextMatch,
        teams: allTeams,
        red: redTeams,
        blue: blueTeams
    });

    // Runs in background
    scoreAllForms().catch(err => {
        console.error("Error scoring forms:", err);
    });
}

/**
 * Helper function to get all assignment statuses for the current match.
 * @returns The current assignments of all scouts, filtering out scouts without a current assignment.
 */
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