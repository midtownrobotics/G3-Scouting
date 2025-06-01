export type Day = {
    date: DateString;
    /** Start time in minutes from 12:00 AM. Increments of 30. */
    start: number;
    /** End time in minutes from 12:00 AM. Increments of 30. */
    end: number;
};

export type Block = {
    day: Day,
    /** Time in minutes from 12:00 AM. Increments of 30. */
    time: number,
    /** Unique ID for this block. */
    id: number
}

export type Assignment = {
    color: string;
    name: string;
    id: number;
}

/** Date stoted in the form `YYYY-MM-DD` */
type DateString = Brand<string, "DateString">;
/** Time stored in the form `HH:MM` */
type TimeString = Brand<string, "TimeString">;