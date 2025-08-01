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
            return ["data", "lead", "admin", "form-maker"];
        case Permission.DATA:
            return ["lead", "admin", "form-maker"];
        case Permission.LEAD:
            return ["admin", "form-maker"];
        case Permission.ADMIN:
            return [];
    }
}