import express from 'express';
import http from 'http';
import authHandler from './AuthHandler';

const app = express();
export const server = http.createServer(app);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// app.use(authHandler);

app.get("/api/alive", (req, res) => {
    res.send("alive")
})

app.get("/testlog", (req, res) => {
    console.log(req.query.log)
    res.sendStatus(200)
})