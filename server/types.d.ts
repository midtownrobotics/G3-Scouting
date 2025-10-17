import { Request } from "express";
import UserModel from "./models/users/UserModel";
import { MatchData } from "@shared/schemas/data";

export type Settings = {
    teamNumber: number;
    slackToken: string;
    theBlueAlliance: string;
    nexusEventKey: string;
    nexus: string;
    eventKey: string;
    match: MatchData;
}

interface AuthReq extends Request {
    user?: UserModel
}