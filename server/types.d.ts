import { Permission } from "@shared/schemas/user";
import { Request } from "express";
import UserModel from "./models/users/UserModel";
import { MatchData } from "@shared/schemas/data";

export type Settings = {
    slackClientId: string;
    slackClientSecret: string;
    slackToken: string;
    theBlueAlliance: string;
    eventKey: string;
    match: MatchData;
}

interface AuthReq extends Request {
    user?: UserModel
}