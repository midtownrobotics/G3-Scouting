type Brand<K, T> = K & { __brand: T };

export type Day = {
    date: DateString;
    /** Start time in minutes from 12:00 AM. Increments of 30. */
    start: number;
    /** End time in minutes from 12:00 AM. Increments of 30. */
    end: number;
};

/** Date stoted in the form `YYYY-MM-DD` */
export type DateString = Brand<string, "DateString">;
/** Time stoted in the form `MM:SS` */
export type TimeString = Brand<string, "TimeString">;