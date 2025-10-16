import { ClientToServerMessage } from "@shared/schemas/game";

export function getWebsocket() {
    try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
        return ws;
    } catch (err) {
        return undefined;
    }
}

export function sendWsMsg(ws: WebSocket | undefined, msg: ClientToServerMessage) {
    if (ws === undefined) return;
    ws.send(JSON.stringify(msg));
}