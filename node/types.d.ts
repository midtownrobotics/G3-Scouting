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

type Permission = {
    name: string;
    blacklist: Array<string>;
}

type EditUserFieldData = {
    name: string;
    field: "username" | "password" | "permissionId";
    updated: string;
};

export type AdminPostRequest =
    | {
        action: "editUserField";
        data: {
            id: nubmer;
            field: "username" | "password" | "permissionId" | "reliable";
            updated: string;
        } 
    }
    | {
        action: "addUser";
        data: {
            username: string;
            password: string;
            permissionId: number;
            reliable: boolean;
        }
    }
    | { action: "deleteUser"; data: number }
    | {
        action: "addPerm";
        data: {
            name: string, blacklist: string[]
        }
    }
    | { action: "changeKey"; data: string }
    | { action: "changeDayNumber"; dayNumber: number; }
    | { action: "setMatch"; match: number; }
    | { action: "deploySchedule"; schedule: Schedule }
    | { action: "resetAssignedMatchData" }
    | { action: "deleteRow", rowId: number }
    | { action: "startBlockEarly" }
    | { action: "cancelStartBlockEarly" }
    | { action: "deployPriorityList", priorityList: string[] };

export type AdminPostResponse = {
    "editUserField": { status: "OK" | "Bad User" },
    "addUser": { status: "OK" | "Bad User" },
    "deleteUser": { status: "OK" },
    "addPerm": { status: "OK" },
    "changeKey": { status: "OK" },
    "changeDayNumber": { status: "OK" },
    "setMatch": { status: "OK" },
    "deploySchedule": { status: "OK" },
    "resetAssignedMatchData": { status: "OK" },
    "deleteRow": { status: "OK" },
    "startBlockEarly": { status: "OK" },
    "cancelStartBlockEarly": { status: "OK" },
    "deployPriorityList": { status: "OK" }
};

export type ResponseKeyValuePair = {
    name: string;
    value: string;
}

export type GeneralPostRequest =
    | { action: "getKey" }
    | { action: "getDayNumber" }
    | { action: "getBlocks" }
    | { action: "getCurrentMatch" }
    | { action: "postFormData", data: ResponseKeyValuePair[], matchNumber?: number, form: string };

export type GeneralPostResponse = {
    "getKey": { key: string };
    "getDayNumber": { dayNumber: string };
    "getBlocks": { blocks: string[] };
    "getCurrentMatch": { match: number };
    "postFormData": { status: "OK" | "ERROR" };
}

export type Station = "blue1" | "blue2" | "blue3" | "red1" | "red2" | "red3";

export type Alliance = "blue" | "red";

export type UserGetData = {
    name: string,
    lastMatchScouted?: number,
    nextMatch?: NextMatch
}

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