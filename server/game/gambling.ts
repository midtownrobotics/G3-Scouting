import { GamblingQuestion, Bet, ResponseBetData } from "@shared/schemas/game";
import UserModel from "server/models/users/UserModel";
import { gameWsHandler } from "server/routing/router";
import { getSettingsValue } from "server/settings";

const gamblingQuestions: GamblingQuestion[] = [{
    match: 25,
    question: "What is Walton robotics team 2974?",
    responses: ["No", "Yes"]
}];

export function addQuestion(question: GamblingQuestion) {
    const currentIndex = gamblingQuestions.findIndex(q => q.match === question.match);
    if (currentIndex !== -1) gamblingQuestions.splice(currentIndex, 1);
    gamblingQuestions.push(question);
}

export function getQuestions() {
    return [...gamblingQuestions];
}

export function getQuestion(match: number) {
    return gamblingQuestions.find(q => q.match === match);
}

export async function getCurrentQuestion() {
    const match = (await getSettingsValue("match")).number;
    return getQuestion(match);
}

// Map of matches -> userIds -> bets
export let bets = new Map<number, Map<number, Bet>>();

export async function dropBet(match: number, user: UserModel): Promise<boolean> {
    const currentMatch = (await getSettingsValue("match")).number;
    if (currentMatch !== match) return false;
    const matchBets = bets.get(currentMatch);
    if (!matchBets) return false;

    const success = matchBets.delete(user.id);
    if (success && matchBets.size === 0) {
        bets.delete(currentMatch);
    }
    if (!success) return false;

    await broadcastCurrentMatchBetData();
    return true;
}

export async function updateBet(bet: Bet, user: UserModel): Promise<boolean> {
    if (bet.amount > user.tokens) return false;
    const currentMatch = (await getSettingsValue("match")).number;
    if (bet.match !== currentMatch) return false;

    if (bets.has(bet.match)) {
        bets.get(bet.match)?.set(user.id, bet);
    } else {
        bets.set(bet.match, new Map([[user.id, bet]]));
    }

    await broadcastCurrentMatchBetData();
    gameWsHandler.sendTo({
        type: "userResponse",
        payload: {
            userId: user.id,
            responseIndex: bet.responseIndex,
            amount: bet.amount
        }
    }, user.id)
    return true;
}

export async function setWinningResponse(match: number, responseIndex: number): Promise<boolean> {
    const matchBets = bets.get(match);
    if (matchBets === undefined || matchBets.size === 0) return false;

    const betsArray = Array.from(matchBets.entries());

    const pot = betsArray.reduce((a, b) => a + b[1].amount, 0);
    const winners = betsArray.filter(b => b[1].responseIndex === responseIndex);
    const winnerPot = winners.reduce((a, b) => a + b[1].amount, 0);

    for (const [userId, bet] of winners) {
        const user = await UserModel.findByPk(userId);
        if (user) {
            const award = pot * (bet.amount / winnerPot);
            await user.update({ tokens: user.tokens + award });
        }
    }

    return true;
}

export function getBetData(match: number) {
    const matchBets = bets.get(match);
    const question = getQuestion(match);
    if (!matchBets || !question) return false;

    const data: ResponseBetData[] = question.responses.map((r, i) => ({
        responseIndex: i,
        count: 0,
        response: r,
        percent: 0,
        totalBet: 0,
        payout: 0
    }));
    
    for (const [userId, bet] of matchBets.entries()) {
        data[bet.responseIndex].count ++;
        data[bet.responseIndex].totalBet += bet.amount;
    }

    for (const [i, response] of question.responses.entries()) {
        data[i].percent = data[i].count / matchBets.size;
    }

    return data;
}

export async function getCurrentBetData() {
    const currentMatch = (await getSettingsValue("match")).number;
    return getBetData(currentMatch);
}

async function broadcastCurrentMatchBetData() {
    const data = await getCurrentBetData();
    console.log(data);
    if (data) gameWsHandler.broadcast({ type: "betData", payload: data });
}