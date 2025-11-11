import { useEffect, useState } from "react";
import { DateString } from "@shared/types";
import { Assignment, UserBlockAssignment } from "@shared/schemas/schedule";

export function logState(val?: unknown) {
    useEffect(() => {
        console.log(val);
    }, [val]);
}

export function alertState(val?: unknown) {
    useEffect(() => {
        alert(val);
    }, [val]);
}

export function makeUrlParam(
    name: string,
    val: string | number | undefined,
) {
    useEffect(() => {
        if (val === undefined) return;
        const url = new URL(window.location.href);
        url.searchParams.set(name, val.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    }, [val]);
}

export function useFullscreenStatus() {
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handleChange);

        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    return isFullscreen;
}

export function getAssignmentDuration(assignment?: Assignment, schedule?: UserBlockAssignment[]): number | null {
    if (assignment === undefined || schedule === undefined) return null;

    const currentTime = getCurrentBlockMins();
    const now = new Date();
    const currentDate = getCurrentDate();
    const currentAssignmentId = assignment.id;

    const currentIndex = schedule.findIndex(
        (a) =>
            a.block.time === currentTime &&
            a.block.date === currentDate
    );

    if (currentIndex === -1) return null;

    let endTime = schedule[currentIndex].block.time;

    // Walk forward to find the last matching block time
    for (let i = currentIndex + 1; i < schedule.length; i++) {
        const prev = schedule[i - 1];
        const curr = schedule[i];

        if (
            curr.assignment.id === currentAssignmentId &&
            curr.block.date === prev.block.date &&
            curr.block.time === prev.block.time + 30
        ) {
            endTime = curr.block.time;
        } else {
            break;
        }
    }

    // Convert current real time to minutes since midnight
    const realNowMinutes = now.getHours() * 60 + now.getMinutes();

    const remainingMinutes = Math.max(0, endTime + 30 - realNowMinutes);

    return remainingMinutes;
}

export function getCurrentBlockMins(): number {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(totalMinutes / 30) * 30;
}

export function getCurrentDate(): DateString {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}` as DateString;
}

export function formatDuration(since?: number) {
    if (since === undefined) return "0s";
    const secs = Math.floor((Date.now() - since) / 1000);
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m ${secs % 60}s`;
    return `${secs}s`;
}

/** Parses a number and rounds if decimal is defined. */
export function numberParser(val: string | number | undefined | null, decimal?: number) {
    if (val == undefined) return undefined;
    if (typeof val === "string") val = parseFloat(val);
    if (Number.isNaN(val)) return undefined;
    if (decimal === undefined) return val;

    decimal = 10**decimal;
    return Math.round(val*decimal)/decimal;
}