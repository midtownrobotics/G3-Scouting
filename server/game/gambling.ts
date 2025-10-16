import { Bet, GamblingQuestion, ResponseBetData } from "@shared/schemas/game";
import UserModel from "server/models/users/UserModel";
import { gameWsHandler } from "server/routing/router";
import { getSettingsValue } from "server/settings";

const getCurrentMatch = async () => (await getSettingsValue("match")).number;

const gamblingQuestions: GamblingQuestion[] = [{
    match: 25,
    question: "What is Walton robotics team 2974?",
    responses: ["No", "Yes"],
    locked: false,
    correctResponse: undefined
}];

export async function lockMatch(match: number) {
    const question = gamblingQuestions.find(q => q.match === match);
    if (!question) return false;
    question.locked = true;

    if (await getCurrentMatch() === match) gameWsHandler.broadcast({
        type: "updateQuestion",
        payload: question
    })
}

export async function setCorrectAnswer(responseIndex: number, match: number) {
    const matchBets = bets.get(match);
    if (matchBets === undefined) return;

    let pot = 0;
    let winningPot = 0;

    for (const [_userId, bet] of matchBets.entries()) {
        pot += bet.amount;
        if (bet.responseIndex === responseIndex) winningPot += bet.amount;
    }

    for (const [userId, bet] of matchBets.entries()) {
        if (bet.responseIndex === responseIndex) {
            const user = await UserModel.findByPk(userId);
            const winnings = pot * (bet.amount / winningPot);
            user?.update({ tokens: user.tokens + winnings });
        }
    }
}

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
    const match = await getCurrentMatch();
    return getQuestion(match);
}

// Map of matches -> userIds -> bets
export let bets = new Map<number, Map<number, Bet>>();

export async function dropBet(match: number, user: UserModel): Promise<boolean> {
    const currentMatch = await getCurrentMatch();
    if (currentMatch !== match) return false;
    const questionUnlocked = getQuestion(match)?.locked === false
    const matchBets = bets.get(currentMatch);
    if (!matchBets || !questionUnlocked) return false;

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
    const currentMatch = await getCurrentMatch();
    if (bet.match !== currentMatch) return false;
    const questionUnlocked = getQuestion(bet.match)?.locked === false;
    if (!questionUnlocked) return false;
    if (bets.get(bet.match)?.get(user.id)?.amount === bet.amount) return false;

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
        data[bet.responseIndex].count++;
        data[bet.responseIndex].totalBet += bet.amount;
    }

    for (const [i, response] of question.responses.entries()) {
        data[i].percent = data[i].count / matchBets.size;
    }

    return data;
}

export async function getCurrentBetData() {
    const currentMatch = await getCurrentMatch();
    return getBetData(currentMatch);
}

async function broadcastCurrentMatchBetData() {
    const data = await getCurrentBetData();
    console.log(data);
    if (data) gameWsHandler.broadcast({ type: "betData", payload: data });
}