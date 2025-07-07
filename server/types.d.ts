import { Permission } from "@shared/schemas/API";
import { Request } from "express";
import UserModel from "./models/users/UserModel";

export type Settings = {
    keys: {
        slack: string;
        theBlueAlliance: string;
    }
    eventKey: string;
    dayNumber: number;
    match: number;
    permissionLevels: Array<Permission>;
    earlyBlock: string | null;
    teamPriority: string[];
}
type NextMatch = {
    number: number,
    team: number
}

interface AuthReq extends Request {
    user?: UserModel
}