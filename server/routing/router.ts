import express from 'express';
import http from 'http';
import authHandler from './authHandler';
import adminAPIRouter from './adminAPI';
import { ENABLE_AUTH, PRODUCTION } from '../../shared/constants';
import path from 'path';
import formAPIRouter from './formsAPI';

const app = express();
export const server = http.createServer(app);

app.use(express.json());

app.use("/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

if (ENABLE_AUTH) app.use(authHandler);
if (PRODUCTION) app.use(express.static(path.join(__dirname + "../../../client/dist")));

app.get("/api/status", (req, res) => {
    res.send("ok")
})

app.use("/api/admin", adminAPIRouter)
app.use("/api/forms", formAPIRouter)