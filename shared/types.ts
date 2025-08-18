import { z } from "zod";

type Brand<K, T> = K & { __brand: T; };

export type Day = {
    date: DateString;
    /** Start time in minutes from 12:00 AM. Increments of 30. */
    start: number;
    /** End time in minutes from 12:00 AM. Increments of 30. */
    end: number;
};

/** Date stored in the form `YYYY-MM-DD` */
export type DateString = Brand<string, "DateString">;
export const DateString = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .transform((val) => val as DateString);

/** Time stored in the form `MM:SS` */
export type TimeString = Brand<string, "TimeString">;

export type PageKey = (
    "home" | 
    "admin" | 
    "data" | 
    "forms" | 
    "settings" | 
    "lead" | 
    "form-maker" | 
    "shift-tracker" |
    "scheduler" |
    "pit-monitor"
);

export const morePages: PageKey[] = ["form-maker", "shift-tracker", "scheduler", "pit-monitor"];