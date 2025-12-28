import { ClientToServerMessage } from "@shared/schemas/game";

export function sendWsMsg(ws: WebSocket | undefined, msg: ClientToServerMessage) {
    if (ws === undefined) return;
    ws.send(JSON.stringify(msg));
}