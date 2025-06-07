export type Day = {
    date: DateString;
    /** Start time in minutes from 12:00 AM. Increments of 30. */
    start: number;
    /** End time in minutes from 12:00 AM. Increments of 30. */
    end: number;
};

/** A block of time with a specific date and time. Increments of 30mins. */
export type Block = {
    day: Day,
    /** Time in minutes from 12:00 AM (0mins-1440mins). Increments of 30mins. */
    time: number,
    /** Unique ID for this block. */
    id: number
}

export enum AssignmentType {
    BREAK = "Break",
    SCOUTING = "Scouting"
}

export type Assignment = {
    color: string;
    name: string;
    id: number;
    type: AssignmentType;
}

/** Date stoted in the form `YYYY-MM-DD` */
type DateString = Brand<string, "DateString">;