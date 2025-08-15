import { PageKey } from "./types";

export enum Permission {
    SCOUT = "SCOUT",
    DATA = "DATA",
    LEAD = "LEAD",
    ADMIN = "ADMIN"
}

export function getDisallowedPages(permission: Permission): PageKey[] {
    switch (permission) {
        case Permission.SCOUT:
            return ["data", "lead", "admin", "form-maker", "scheduler"];
        case Permission.DATA:
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
            return ["data", "lead", "admin"];
        case Permission.DATA:
            return ["lead", "admin"];
        case Permission.LEAD:
            return ["admin"];
        case Permission.ADMIN:
            return [];
    }
}