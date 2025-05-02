import { Permission } from "@shared/schemas/API";
import { Request } from "express";

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

export type Station = "blue1" | "blue2" | "blue3" | "red1" | "red2" | "red3";

export type Alliance = "blue" | "red";

export type Schedule = {
    [userId: string]: {
        assignments: Assignment[],
        alliance: Alliance
    }
}

type Status = "scouting" | "break";

type Assignment = {
    time: string,
    status: Status
}

type NextMatch = {
    number: number,
    team: number
}

export type BlockParts = {
    day: number,
    hour: number,
    minutes: 30 | 0
}

interface AuthReq extends Request {
    user?: UserModel
}