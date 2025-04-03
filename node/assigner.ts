import { APICalls, MatchSimple } from "thebluealliancev3";
import { TBA } from ".";
import UserModel from "./models/UserModel";
import { getSettings, writeSettings } from "./storage";
import { Schedule } from "./types";
import { getCurrentScoutingBlock } from "./blockManager";

let matches: MatchSimple[] = [];

export let assignedScouts: UserModel[] = []

/**
 * Gets team priority from team key.
 * @param teamKey The team key: `"frc"+number`
 * @param teamPriorityList The team priority list.
 * @returns Index or {@link Number.MAX_VALUE} if index is -1.
 */
function getPriorityFromKey(teamKey: string, teamPriorityList: string[]): number {
    const index = teamPriorityList.indexOf(teamKey.slice(3)) 
    return index == -1 ? Number.MAX_VALUE : index
}

export async function generateSchedule(schedule: Schedule) {
    const userIds = Object.keys(schedule);

    for (let i = 0; i < userIds.length; i++) {
        const user = await UserModel.findOne({ where: { id: parseInt(userIds[i]) } })
        if (!user) continue;
        user?.update({ assignments: schedule[userIds[i]].assignments })
        user?.update({ assignedAlliance: schedule[userIds[i]].alliance })
    }

    const settings = await getSettings()
    settings.match = 0
    writeSettings(settings)
}

export async function setMatch(matchNumber: number) {
    if (!matches || matches.length <= 0) {
        console.log("Re-fetching match data from TBA...")
        matches = await TBA.get({ call: APICalls.event.matches.simple, event_key: (await getSettings()).eventKey });
        console.log("Done!")
    }

    const match = matches.find((m) => m.match_number == matchNumber && m.comp_level == "qm")
    if (!match) {
        console.error(`ERROR: Could not find data for match #${matchNumber}`)
        return
    }
    const currentScoutingBlock = await getCurrentScoutingBlock();
    const teamPriorityList = (await getSettings()).teamPriority
    const blueTeams = match.alliances.blue.team_keys.sort((a, b) => getPriorityFromKey(b, teamPriorityList) - getPriorityFromKey(a, teamPriorityList));
    const redTeams = match.alliances.red.team_keys.sort((a, b) => getPriorityFromKey(b, teamPriorityList) - getPriorityFromKey(a, teamPriorityList));

    console.log(redTeams, blueTeams)

    const avalibleScouts = (await UserModel.getAllUsers()).filter((u) => {
        const avalible = u.assignments && (u.assignments.some((a) => {
            return a.time == currentScoutingBlock && a.status == "scouting";
        }))
        console.log(u.username, avalible)
        return avalible
    })
    const redScouts = avalibleScouts.filter((u) => u.assignedAlliance == "red")
    const blueScouts = avalibleScouts.filter((u) => u.assignedAlliance == "blue")

    assignedScouts = avalibleScouts

    for (let i = 0; i < redScouts.length; i++) {
        const currentMatches = redScouts[i].assignedMatches
        redScouts[i].update({
            nextMatch: {
                number: matchNumber,
                team: parseInt(redTeams[i % 3].slice(3))
            },
            assignedMatches: [...currentMatches, matchNumber]
        })
    }

    for (let i = 0; i < blueScouts.length; i++) {
        const currentMatches = blueScouts[i].assignedMatches
        blueScouts[i].update({
            nextMatch: {
                number: matchNumber,
                team: parseInt(blueTeams[i % 3].slice(3))
            },
            assignedMatches: [...currentMatches, matchNumber]
        })
    }

    const settings = await getSettings()
    settings.match = matchNumber
    writeSettings(settings)
}