import { ClientToServerMessage, ServerToClientMessage } from "@shared/schemas/game";
import UserModel from "server/models/users/UserModel";
import { getSettingsValue } from "server/settings";
import { WebSocket } from "ws";
import { bets, dropBet, getCurrentBetData, updateBet } from "./gambling";

type GameWebsocketData = {
    ws: WebSocket,
    user: UserModel
}

export default class GameWebsocketHandler {
    private sockets: GameWebsocketData[] = [];

    async add(ws: WebSocket, user: UserModel) {
        this.sockets.push({ ws, user });

        const currentMatch = (await getSettingsValue("match")).number;

        const currentBetData = await getCurrentBetData();
        if (currentBetData) this.sendTo({
            type: "betData",
            payload: currentBetData
        }, user.id);
        
        this.sendTo({
            type: "userResponse",
            payload: {
                userId: user.id,
                responseIndex: bets.get(currentMatch)?.get(user.id)?.responseIndex ?? 0,
                amount: bets.get(currentMatch)?.get(user.id)?.amount ?? 0
            }
        }, user.id)

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
        const i = this.sockets.findIndex(s => s.user.id === userId);
        this.sockets.splice(i, 1);
    }

    broadcast(msg: ServerToClientMessage) {
        for (const socket of this.sockets) {
            socket.ws.send(JSON.stringify(msg));
        }
    }

    sendTo(msg: ServerToClientMessage, userId: number) {
        this.sockets.find(s => s.user.id === userId)?.ws.send(JSON.stringify(msg));
    }
}
