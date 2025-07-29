import { Permission } from "@shared/schemas/API";
import { Request } from "express";
import UserModel from "./models/users/UserModel";

export type Settings = {
    slackClientId: string;
    slackClientSecret: string;
    slackToken: string;
    theBlueAlliance: string;
    eventKey: string;
    match: number;
}

interface AuthReq extends Request {
    user?: UserModel
}