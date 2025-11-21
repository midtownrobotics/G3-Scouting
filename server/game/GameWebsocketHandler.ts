import { ClientToServerMessage, ServerToClientMessage } from "@shared/schemas/game";
import UserModel from "server/models/users/UserModel";
import { getSettingsValue } from "server/other/settings";
import { WebSocket } from "ws";
import { bets, dropBet, getCurrentBetData, getCurrentQuestion, updateBet } from "./gambling";

type GameWebsocketData = {
    ws: WebSocket,
    user: UserModel
}

export default class GameWebsocketHandler {
    private sockets: Map<number, GameWebsocketData> = new Map();

    async add(ws: WebSocket, user: UserModel) {
        this.sockets.set(user.id, { ws, user });

        const currentMatch = (await getSettingsValue("match")).number;

        const currentBetData = await getCurrentBetData();
        if (currentBetData) this.sendTo({
            type: "betData",
            payload: currentBetData
        }, ws);

        const currentQuestion = await getCurrentQuestion();
        if (currentQuestion) this.sendTo({
            type: "updateQuestion",
            payload: currentQuestion
        }, ws);

        this.sendTo({
            type: "userResponse",
            payload: {
                userId: user.id,
                responseIndex: bets.get(currentMatch)?.get(user.id)?.responseIndex ?? 0,
                amount: bets.get(currentMatch)?.get(user.id)?.amount ?? 0,
                tokens: user.tokens
            }
        }, ws);

        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "ping" }))
            } else {
                clearInterval(interval)
            }
        }, 30000);

        ws.on("message", async (data) => {
            try {
                const json = JSON.parse(data.toString());
                const msg = ClientToServerMessage.parse(json);

                switch (msg.type) {
                    case "placeBet":
                        updateBet(msg.payload, user);
                        break;
                    case "dropBet":
                        dropBet(msg.payload.match, user);
                        break;
                }
            } catch (err) {
                ws.send(JSON.stringify({ type: "ERROR", message: err instanceof Error ? err.message : "Invalid" }));
            }
        });
    }

    delete(userId: number) {
        this.sockets.delete(userId);
    }

    broadcast(msg: ServerToClientMessage) {
        for (const socket of this.sockets) {
            socket[1].ws.send(JSON.stringify(msg));
        }
    }

    sendTo(msg: ServerToClientMessage, userId: number): void;
    sendTo(msg: ServerToClientMessage, websocket: WebSocket): void;
    sendTo(msg: ServerToClientMessage, to: number | WebSocket) {
        if (typeof to === "number") {
            this.sockets.get(to)?.ws.send(JSON.stringify(msg));
        } else {
            to.send(JSON.stringify(msg));
        }
    }
}
