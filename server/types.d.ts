import { Permission } from "@shared/schemas/API";
import { Request } from "express";
import UserModel from "./models/users/UserModel";

export type Settings = {
    keys: {
        slack: {
            clientId: string,
            clientSecret: string,
            token: string
        }
        theBlueAlliance: string;
    }
    eventKey: string;
    match: number;
    permissionLevels: Permission[];
    earlyBlock: string | null;
    teamPriority: string[];
}

interface AuthReq extends Request {
    user?: UserModel
}