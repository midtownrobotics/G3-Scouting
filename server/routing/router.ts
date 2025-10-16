import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import path from 'path';
import { PRODUCTION } from '../../shared/config';
import adminAPIRouter from './adminAPI';
import { authHandler, loginHandler } from './authentication';
import formAPIRouter from './formsAPI';
import genericAPIRouter from './genericAPI';
import slackAPIRouter from './slackAPI';
import userSettingsAPIRouter from './userSettingsAPI';
import dataApiRouter from './dataAPI';
import leadAPIrouter from './leadAPI';
import pitAPIRouter from './pitAPI';
import docsRouter from './docsRouter';
import gameAPIRouter from './gameAPI';
import { WebSocketServer, WebSocket } from 'ws';
import SessionModel from 'server/models/users/SessionModel';
import UserModel from 'server/models/users/UserModel';
import GameWebsocketHandler from 'server/game/GameWebsocketHandler';

const app = express();
export const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(docsRouter);

if (PRODUCTION) app.use(express.static(path.join(__dirname + "../../../../../client/dist")));

app.post("/api/login", loginHandler);
app.use("/api", authHandler);

app.use("/api", genericAPIRouter);
app.use("/api/admin", adminAPIRouter);
app.use("/api/pit", pitAPIRouter);
app.use("/api/forms", formAPIRouter);
app.use("/api/data", dataApiRouter)
app.use("/api/slack", slackAPIRouter);
app.use("/api/lead", leadAPIrouter);
app.use("/api/userSettings", userSettingsAPIRouter);
app.use("/api/game", gameAPIRouter);
import { parse as parseCookie } from "cookie";

const wss = new WebSocketServer({ server });

export const gameWsHandler = new GameWebsocketHandler();

wss.on("connection", async (ws: WebSocket, req) => {
    const cookieHeader = req.headers.cookie;
    const cookies = cookieHeader ? parseCookie(cookieHeader) : {};
    const sessionToken = cookies.sessionToken;
    const userId = (await SessionModel.findByPk(sessionToken))?.userId;
    if (!userId) { ws.close(4003, "Forbidden"); return; }

    const user = await UserModel.findByPk(userId);
    if (!user) { ws.close(4003, "Forbidden"); return; }

    gameWsHandler.add(ws, user);

    ws.on("close", () => {
        gameWsHandler.delete(userId);
    });
});