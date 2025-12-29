import { PageKey } from "./types";

export enum Permission {
    SCOUT = "SCOUT",
    DATA = "DATA",
    LEAD = "LEAD",
    ADMIN = "ADMIN",
    BOOKIE = "BOOKIE"
}

export function getDisallowedPages(permission: Permission): PageKey[] {
    switch (permission) {
        case Permission.SCOUT:
            return ["bookie", "data", "lead", "admin", "form-maker", "scheduler"];
        case Permission.DATA:
            return ["bookie", "lead", "admin", "form-maker", "scheduler"];
        case Permission.BOOKIE:
            return ["lead", "admin", "form-maker", "scheduler"];
        case Permission.LEAD:
            return ["admin", "form-maker", "scheduler"];
        case Permission.ADMIN:
            return [];
    }
}

export function getDisallowedApis(permission: Permission): string[] {
    switch (permission) {
        case Permission.SCOUT:
            return ["data", "lead", "admin", "game/bookie"];
        case Permission.DATA:
            return ["lead", "admin", "game/bookie"];
        case Permission.BOOKIE:
            return ["lead", "admin"];
        case Permission.LEAD:
            return ["admin"];
        case Permission.ADMIN:
            return [];
    }
}