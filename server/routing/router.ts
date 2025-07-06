import express from 'express';
import http from 'http';
import path from 'path';
import { PRODUCTION } from '../../shared/constants';
import adminAPIRouter from './adminAPI';
import authHandler from './authHandler';
import formAPIRouter from './formsAPI';

const app = express();
export const server = http.createServer(app);

app.use(express.json());

if (PRODUCTION) app.use(express.static(path.join(__dirname + "../../../client/dist")));

app.get("/api/status", (req, res) => {
    res.send("ok")
})

// Unproteced API routes ⬆⬆⬆⬆⬆
app.use("/api", authHandler);
// Protected API routes  ⬇⬇⬇⬇⬇

app.use("/api/admin", adminAPIRouter)
app.use("/api/forms", formAPIRouter)