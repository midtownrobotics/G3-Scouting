import { TimeString } from "@shared/types";

/** Converts a {@link TimeString} to a `number` of minutes. Ex: `1:20` -> `80` */
export function toTimeMins(time: TimeString) {
    const split = time.split(":");
    const hours = parseInt(split[0])
    const mins = parseInt(split[1])
    return hours*60 + mins;
}

/** Converts a `number` of minutes to a {@link TimeString}. Ex: `80` -> `1:20` */
export function toTimeString(minutes: number): TimeString {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}` as TimeString;
}

/** Converts a `number` of minutes to a {@link TimeString} with `AM` or `PM` added. Ex: `80` -> `01:20 AM` */
export function toFormattedTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${(((hours - 1) % 12) + 1).toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? "PM" : "AM"}`;
}