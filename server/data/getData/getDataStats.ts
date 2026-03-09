import FormModel from "server/models/forms/FormModel";
import { getAllTeams, getTeamEventData } from "server/externalApis/tba/tba";

export default async function getDataStats(formId: string) {
    const form = await FormModel.getForm(formId, true);
    if (!form) return null;

    const responseData = form.getResponseData();
    if (!responseData) return null;

    const allTeams = await getAllTeams();
    if (!allTeams) return null;

    const teamEventDataPromises = allTeams.map(team => 
        getTeamEventData(team.team_number).then(data => ({
            teamNumber: team.team_number,
            data
        }))
    );

    const teamEventDataResults = await Promise.all(teamEventDataPromises);
    const teamEventDataMap = new Map(
        teamEventDataResults.map(r => [r.teamNumber, r.data])
    );

    const teamCoverage = [];
    let totalMatchesScouted = 0;
    let totalMatches = 0;
    let totalError = 0;
    let errorCount = 0;

    for (const team of allTeams) {
        const teamNumber = team.team_number;
        
        const teamEventData = teamEventDataMap.get(teamNumber);
        const totalTeamMatches = teamEventData?.qual.ranking.matches_played || 0;
        
        // Filter responses for this team
        const teamResponses = responseData.responses.filter(r => r.team == teamNumber)
        
        // Count unique matches scouted for this team
        const uniqueMatches = new Set(teamResponses.map(r => r.match).filter(m => m !== undefined));
        const matchesScouted = uniqueMatches.size;
        
        // Calculate accuracy for this team's responses
        teamResponses.forEach(r => {
            if (r.accuracyScore !== null && r.accuracyScore !== undefined) {
                totalError += r.accuracyScore;
                errorCount++;
            }
        });
        
        if (totalTeamMatches > 0) {
            const percentage = (matchesScouted / totalTeamMatches) * 100;
            teamCoverage.push({
                team: teamNumber.toString(),
                matchesScouted,
                totalMatches: totalTeamMatches,
                percentage
            });
            
            totalMatchesScouted += matchesScouted;
            totalMatches += totalTeamMatches;
        }
    }

    const totalCoverage = totalMatches > 0 ? (totalMatchesScouted / totalMatches) * 100 : 0;
    const averageError = errorCount > 0 ? totalError / errorCount : 0;

    return {
        teamCoverage: teamCoverage.sort((a, b) => b.percentage - a.percentage),
        totalCoverage,
        averageError
    };
}