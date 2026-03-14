import { Bet, GamblingQuestion, ResponseBetData } from "@shared/schemas/game";
import UserModel from "server/models/users/UserModel";
import { gameWsHandler } from "server/routing/router";
import { getSettingsValue } from "server/other/settings";
import { sendNotification } from "server/other/notifications";
import { Question } from "react-bootstrap-icons";

const getCurrentMatch = async () => (await getSettingsValue("match")).number;

const gamblingQuestions: GamblingQuestion[] = [];

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

            sendNotification(
                `You won ${winnings} BoyleBucks in match ${match}!!`,
                "game",
                new Date(Date.now() + 60 * 1000),
                99,
                userId
            );
            continue;
        }
        sendNotification(
            `You lost your bet in match ${match}.`,
            "game",
            new Date(Date.now() + 60 * 1000),
            99,
            userId
        );
    }
}

export function addQuestion(question: GamblingQuestion) {
    const currentIndex = gamblingQuestions.findIndex(q => q.match === question.match);
    if (currentIndex !== -1) {
        const currentQuestion = gamblingQuestions[currentIndex];
        if (
            question.correctResponse !== currentQuestion.correctResponse && 
            question.correctResponse !== undefined &&
            question.locked
        ) {
            setCorrectAnswer(question.correctResponse, question.match);
        }
        gamblingQuestions.splice(currentIndex, 1);
        gameWsHandler.broadcast({
            type: "updateQuestion",
            payload: question
        })
    }
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

    const bet = matchBets.get(user.id)?.amount ?? 0;
    const success = matchBets.delete(user.id);
    if (success && matchBets.size === 0) {
        bets.delete(currentMatch);
    }

    if (!success) return false;

    const tokens = user.tokens + bet;
    await user.update({ tokens });

    gameWsHandler.sendTo({
        type: "userResponse",
        payload: {
            userId: user.id,
            responseIndex: 0,
            amount: 0,
            tokens
        }
    }, user.id);

    await broadcastCurrentMatchBetData();
    return true;
}

export async function updateBet(bet: Bet, user: UserModel): Promise<boolean> {
    const currentMatch = await getCurrentMatch();
    if (bet.match !== currentMatch) return false;
    const questionUnlocked = getQuestion(bet.match)?.locked === false;
    if (!questionUnlocked) return false;

    const currentBet = bets.get(bet.match)?.get(user.id)?.amount ?? 0;

    if (bet.amount > (user.tokens + currentBet)) return false;

    if (bets.has(bet.match)) {
        bets.get(bet.match)!.set(user.id, bet);
    } else {
        bets.set(bet.match, new Map([[user.id, bet]]));
    }

    const tokens = user.tokens + (currentBet - bet.amount);
    await user.update({ tokens });

    await broadcastCurrentMatchBetData();
    gameWsHandler.sendTo({
        type: "userResponse",
        payload: {
            userId: user.id,
            responseIndex: bet.responseIndex,
            amount: bet.amount,
            tokens: user.tokens + bet.amount
        }
    }, user.id)
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
        totalBet: 0
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
    gameWsHandler.broadcast({ type: "betData", payload: data || [] });
}