import { ClientToServerMessage, PickListItem, ServerToClientMessage } from "@shared/schemas/data";
import UserModel from "server/models/users/UserModel";
import { WebSocket } from "ws";

type PickListWebsocketData = {
    ws: WebSocket,
    user: UserModel
}

// [(PickList), (NoPickList)]
let lists: [PickListItem[], PickListItem[]] = [[],[]];

export default class PickListWebsocketHandler {
    private sockets: Map<number, PickListWebsocketData> = new Map();

    async add(ws: WebSocket, user: UserModel) {
        this.sockets.set(user.id, { ws, user });

        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "ping" }))
            } else {
                clearInterval(interval)
            }
        }, 30000);

        this.sendTo({
            type: "getPickList",
            payload: {
                list: lists[0],
                id: 0
            }
        }, ws);

        this.sendTo({
            type: "getPickList",
            payload: {
                list: lists[1],
                id: 1
            }
        }, ws);

        ws.on("message", async (data) => {
            try {
                const json = JSON.parse(data.toString());
                const msg = ClientToServerMessage.parse(json);

                switch (msg.type) {
                    case "setPickList":

                        lists[msg.payload.id] = msg.payload.list;

                        this.broadcast({
                            type: "getPickList",
                            payload: {
                                list: lists[msg.payload.id],
                                id: msg.payload.id
                            }
                        })

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
