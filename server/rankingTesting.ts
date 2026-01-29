// Types for our ranking system
interface ScoutRanking {
    scoutId: string;
    teamRankings: TeamRank[];
}

interface TeamRank {
    teamId: string;
    rank: number; // 1-6, where 1 is best
}

interface MatchResult {
    matchId: string;
    scoutRankings: ScoutRanking[]; // Should have 3 scouts
}

interface TeamRating {
    teamId: string;
    rating: number;
    matchCount: number;
}

// Elo configuration
const INITIAL_RATING = 1500;
const K_FACTOR = 32; // How much ratings change per comparison

/**
 * Calculate the average rank for a team from multiple scouts
 */
function getAverageRank(teamId: string, scoutRankings: ScoutRanking[]): number {
    let totalRank = 0;
    let scoutCount = 0;

    for (const scout of scoutRankings) {
        const teamRank = scout.teamRankings.find((tr) => tr.teamId === teamId);
        if (teamRank) {
            totalRank += teamRank.rank;
            scoutCount++;
        }
    }

    return scoutCount > 0 ? totalRank / scoutCount : 0;
}

/**
 * Calculate expected score for team A vs team B based on Elo ratings
 * Returns a value between 0 and 1 (probability A should beat B)
 */
function getExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate actual score based on ranking positions
 * If A ranked better than B, A gets 1.0, B gets 0.0
 * We can also scale this based on the ranking gap for more nuance
 */
function getActualScore(rankA: number, rankB: number): number {
    if (rankA < rankB) return 1.0; // A ranked better (lower rank = better)
    if (rankA > rankB) return 0.0; // B ranked better
    return 0.5; // Tie
}

/**
 * Update Elo ratings based on a pairwise comparison
 */
function updateEloRatings(
    ratingA: number,
    ratingB: number,
    actualScore: number
): { newRatingA: number; newRatingB: number } {
    const expectedA = getExpectedScore(ratingA, ratingB);
    const expectedB = 1 - expectedA;

    const newRatingA = ratingA + K_FACTOR * (actualScore - expectedA);
    const newRatingB = ratingB + K_FACTOR * ((1 - actualScore) - expectedB);

    return { newRatingA, newRatingB };
}

/**
 * Process all matches and calculate Elo ratings
 */
function calculateEloRankings(matches: MatchResult[]): TeamRating[] {
    const ratings = new Map<string, { rating: number; matchCount: number }>();

    // Initialize all teams with base rating
    for (const match of matches) {
        for (const scout of match.scoutRankings) {
            for (const teamRank of scout.teamRankings) {
                if (!ratings.has(teamRank.teamId)) {
                    ratings.set(teamRank.teamId, { rating: INITIAL_RATING, matchCount: 0 });
                }
            }
        }
    }

    // Process each match
    for (const match of matches) {
        // Get all teams in this match with their average ranks
        const teamsInMatch: Array<{ teamId: string; avgRank: number }> = [];
        const teamIds = new Set<string>();

        for (const scout of match.scoutRankings) {
            for (const teamRank of scout.teamRankings) {
                teamIds.add(teamRank.teamId);
            }
        }

        for (const teamId of teamIds) {
            const avgRank = getAverageRank(teamId, match.scoutRankings);
            teamsInMatch.push({ teamId, avgRank });
        }

        // Increment match count for all teams
        for (const team of teamsInMatch) {
            const current = ratings.get(team.teamId)!;
            current.matchCount++;
        }

        // Process all pairwise comparisons
        // Each team is compared against every other team in the match
        for (let i = 0; i < teamsInMatch.length; i++) {
            for (let j = i + 1; j < teamsInMatch.length; j++) {
                const teamA = teamsInMatch[i];
                const teamB = teamsInMatch[j];

                const ratingA = ratings.get(teamA.teamId)!.rating;
                const ratingB = ratings.get(teamB.teamId)!.rating;

                const actualScore = getActualScore(teamA.avgRank, teamB.avgRank);
                const { newRatingA, newRatingB } = updateEloRatings(
                    ratingA,
                    ratingB,
                    actualScore
                );

                ratings.get(teamA.teamId)!.rating = newRatingA;
                ratings.get(teamB.teamId)!.rating = newRatingB;
            }
        }
    }

    // Convert to array and sort by rating
    const results: TeamRating[] = [];
    for (const [teamId, data] of ratings) {
        results.push({
            teamId,
            rating: data.rating,
            matchCount: data.matchCount,
        });
    }

    results.sort((a, b) => b.rating - a.rating);

    return results;
}

export default function test() {
    // Example match data
    const exampleMatches: MatchResult[] = [
        {
            matchId: "match-1",
            scoutRankings: [
                {
                    scoutId: "scout-A",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-2", rank: 3 },
                        { teamId: "team-3", rank: 2 },
                        { teamId: "team-4", rank: 5 },
                        { teamId: "team-5", rank: 4 },
                        { teamId: "team-6", rank: 6 },
                    ],
                },
                {
                    scoutId: "scout-B",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-2", rank: 3 },
                        { teamId: "team-3", rank: 2 },
                        { teamId: "team-4", rank: 6 },
                        { teamId: "team-5", rank: 4 },
                        { teamId: "team-6", rank: 5 },
                    ],
                },
                {
                    scoutId: "scout-C",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-2", rank: 2 },
                        { teamId: "team-3", rank: 3 },
                        { teamId: "team-4", rank: 5 },
                        { teamId: "team-5", rank: 4 },
                        { teamId: "team-6", rank: 6 },
                    ],
                },
            ],
        },
        {
            matchId: "match-2",
            scoutRankings: [
                {
                    scoutId: "scout-A",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-7", rank: 2 },
                        { teamId: "team-8", rank: 3 },
                        { teamId: "team-9", rank: 4 },
                        { teamId: "team-10", rank: 5 },
                        { teamId: "team-11", rank: 6 },
                    ],
                },
                {
                    scoutId: "scout-B",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-7", rank: 2 },
                        { teamId: "team-8", rank: 3 },
                        { teamId: "team-9", rank: 5 },
                        { teamId: "team-10", rank: 4 },
                        { teamId: "team-11", rank: 6 },
                    ],
                },
                {
                    scoutId: "scout-C",
                    teamRankings: [
                        { teamId: "team-1", rank: 1 },
                        { teamId: "team-7", rank: 2 },
                        { teamId: "team-8", rank: 3 },
                        { teamId: "team-9", rank: 4 },
                        { teamId: "team-10", rank: 5 },
                        { teamId: "team-11", rank: 6 },
                    ],
                },
            ],
        },
        {
            matchId: "match-3",
            scoutRankings: [
                {
                    scoutId: "scout-A",
                    teamRankings: [
                        { teamId: "team-2", rank: 4 },
                        { teamId: "team-3", rank: 3 },
                        { teamId: "team-7", rank: 1 },
                        { teamId: "team-8", rank: 2 },
                        { teamId: "team-12", rank: 5 },
                        { teamId: "team-13", rank: 6 },
                    ],
                },
                {
                    scoutId: "scout-B",
                    teamRankings: [
                        { teamId: "team-2", rank: 5 },
                        { teamId: "team-3", rank: 2 },
                        { teamId: "team-7", rank: 1 },
                        { teamId: "team-8", rank: 3 },
                        { teamId: "team-12", rank: 4 },
                        { teamId: "team-13", rank: 6 },
                    ],
                },
                {
                    scoutId: "scout-C",
                    teamRankings: [
                        { teamId: "team-2", rank: 4 },
                        { teamId: "team-3", rank: 2 },
                        { teamId: "team-7", rank: 1 },
                        { teamId: "team-8", rank: 3 },
                        { teamId: "team-12", rank: 5 },
                        { teamId: "team-13", rank: 6 },
                    ],
                },
            ],
        },
        {
            matchId: "match-4",
            scoutRankings: [
                {
                    scoutId: "scout-A",
                    teamRankings: [
                        { teamId: "team-4", rank: 6 },
                        { teamId: "team-5", rank: 5 },
                        { teamId: "team-6", rank: 4 },
                        { teamId: "team-9", rank: 3 },
                        { teamId: "team-10", rank: 2 },
                        { teamId: "team-11", rank: 1 },
                    ],
                },
                {
                    scoutId: "scout-B",
                    teamRankings: [
                        { teamId: "team-4", rank: 5 },
                        { teamId: "team-5", rank: 6 },
                        { teamId: "team-6", rank: 4 },
                        { teamId: "team-9", rank: 2 },
                        { teamId: "team-10", rank: 3 },
                        { teamId: "team-11", rank: 1 },
                    ],
                },
                {
                    scoutId: "scout-C",
                    teamRankings: [
                        { teamId: "team-4", rank: 6 },
                        { teamId: "team-5", rank: 5 },
                        { teamId: "team-6", rank: 4 },
                        { teamId: "team-9", rank: 3 },
                        { teamId: "team-10", rank: 1 },
                        { teamId: "team-11", rank: 2 },
                    ],
                },
            ],
        },
    ];

    // Run the Elo calculation
    const eloRankings = calculateEloRankings(exampleMatches);

    console.log("Overall Defense Rankings (Elo):");
    console.log("================================");
    eloRankings.forEach((team, index) => {
        console.log(
            `${index + 1}. ${team.teamId}: ${team.rating.toFixed(2)} rating ` +
            `(${team.matchCount} matches)`
        );
    });

    // Show example of how team-1's rating evolved
    console.log("\n\nHow team-1's rating changed:");
    console.log("============================");

    const team1Ratings: number[] = [INITIAL_RATING];
    const singleTeamMatches = exampleMatches.filter((match) =>
        match.scoutRankings[0].teamRankings.some((tr) => tr.teamId === "team-1")
    );

    // Reprocess just to show team-1's progression
    const tempRatings = new Map<string, number>();
    for (const match of exampleMatches) {
        for (const scout of match.scoutRankings) {
            for (const teamRank of scout.teamRankings) {
                if (!tempRatings.has(teamRank.teamId)) {
                    tempRatings.set(teamRank.teamId, INITIAL_RATING);
                }
            }
        }
    }

    for (const match of exampleMatches) {
        const teamsInMatch: Array<{ teamId: string; avgRank: number }> = [];
        const teamIds = new Set<string>();

        for (const scout of match.scoutRankings) {
            for (const teamRank of scout.teamRankings) {
                teamIds.add(teamRank.teamId);
            }
        }

        for (const teamId of teamIds) {
            const avgRank = getAverageRank(teamId, match.scoutRankings);
            teamsInMatch.push({ teamId, avgRank });
        }

        const hasTeam1 = teamsInMatch.some((t) => t.teamId === "team-1");

        for (let i = 0; i < teamsInMatch.length; i++) {
            for (let j = i + 1; j < teamsInMatch.length; j++) {
                const teamA = teamsInMatch[i];
                const teamB = teamsInMatch[j];

                const ratingA = tempRatings.get(teamA.teamId)!;
                const ratingB = tempRatings.get(teamB.teamId)!;

                const actualScore = getActualScore(teamA.avgRank, teamB.avgRank);
                const { newRatingA, newRatingB } = updateEloRatings(
                    ratingA,
                    ratingB,
                    actualScore
                );

                tempRatings.set(teamA.teamId, newRatingA);
                tempRatings.set(teamB.teamId, newRatingB);
            }
        }

        if (hasTeam1) {
            const team1Rank = teamsInMatch.find((t) => t.teamId === "team-1")!.avgRank;
            console.log(
                `After ${match.matchId}: ${tempRatings.get("team-1")!.toFixed(2)} ` +
                `(avg rank: ${team1Rank.toFixed(2)})`
            );
        }
    }

    console.log("\n\nKey insight:");
    console.log(
        "Notice how team-7 might rank highly despite not appearing in as many matches,"
    );
    console.log(
        "because they consistently beat strong opponents (like team-1 and team-3)."
    );
}