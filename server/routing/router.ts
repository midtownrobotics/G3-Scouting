import express from 'express';
import http from 'http';
import authHandler from './AuthHandler';

const app = express();
export const server = http.createServer(app);

app.use(authHandler);