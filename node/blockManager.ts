import { getSettings, writeSettings } from "./storage";
import { BlockParts } from "./types";

/**
 * List of scouting blocks. Should be in format `[day]-[hour]:(30 | 00)`. 
 * @example ["1-11:00", "1-11:30", "1-12:00", "2-21:00", "2-21:30"]
 */
export const SCOUTING_BLOCKS: string[] = [
    "1-8:00", "1-8:30",
    "1-9:00", "1-9:30",
    "1-10:00", "1-10:30",
    "1-11:00", "1-11:30",
    "1-12:00", "1-12:30",
    "1-13:00", "1-13:30",
    "1-14:00", "1-14:30",
    "1-15:00", "1-15:30",
    "1-16:00", "1-16:30",
    "1-17:00", "1-17:30",
    "1-18:00", "1-18:30",
    "1-19:00", "1-19:30",
    "2-8:00", "2-8:30",
    "2-9:00", "2-9:30",
    "2-10:00", "2-10:30",
    "2-11:00", "2-11:30",
    "2-12:00", "2-12:30",
    "2-13:00", "2-13:30",
    "2-14:00", "2-14:30",
    "2-15:00", "2-15:30",
    "2-16:00", "2-16:30",
    "2-17:00", "2-17:30",
    "2-18:00",
    "3-8:00", "3-8:30",
    "3-9:00", "3-9:30",
    "3-10:00", "3-10:30",
    "3-11:00", "3-11:30",
    "3-12:00", "3-12:30",
    "3-13:00", "3-13:30",
    "3-14:00", "3-14:30",
    "3-18:00", "3-18:30"
];

/** 
 * Get the current scouting block based on local time and preset day number, plus an offest. 
 * @param offset Number of blocks to offset the result by.
 */
export async function getCurrentScoutingBlock(offset: number): Promise<string | null>
/** Get the current scouting block based on local time and preset day number. */
export async function getCurrentScoutingBlock(): Promise<string | null>
export async function getCurrentScoutingBlock(offset: number = 0): Promise<string | null> {
    const date = new Date();
    const settings = await getSettings();
    const earlyBlock = settings.earlyBlock;
    let day = settings.dayNumber;
    let hour = date.getHours();
    let minutes = (Math.floor(date.getMinutes() / 30) * 30) as (30 | 0);

    if (offset) ({ day, hour, minutes } = offsetBlock({ day, hour, minutes }, offset));

    if (!day) {
        console.error("No dayNumber set!");
        return null;
    }

    const block = generateBlockFormat({ day, hour, minutes });

    if (!earlyBlock) return block;
    const parsedEarlyBlock = parseBlock(earlyBlock)
    if (parsedEarlyBlock.day != day) return block;
    if (parsedEarlyBlock.hour == hour ? parsedEarlyBlock.minutes == minutes : parsedEarlyBlock.hour <= hour) {
        settings.earlyBlock = null;
        writeSettings(settings);
        return block;
    }

    return earlyBlock
}

/** Starts the next scouting block early. */
export async function earlyStartBlock(): Promise<void>
/** 
 * Starts the next scouting block early or cancels the early starting. 
 * @param cancel Whether to cancel the block starting early or to start the next block early.
 */
export async function earlyStartBlock(cancel: boolean): Promise<void>
export async function earlyStartBlock(cancel: boolean = false) {
    const settings = await getSettings()
    settings.earlyBlock = cancel ? null : await getCurrentScoutingBlock(1)
    writeSettings(settings)
}

/** Generates a block string from the individual parts of the block. */
const generateBlockFormat = (block: BlockParts): string => block.day + "-" + block.hour.toString() + ":" + block.minutes.toString().padStart(2, "0");

/** Gets the individual parts of a block string. */
function parseBlock(block: string): BlockParts {
    const [day, time] = block.split("-");
    const [hour, minutes] = time.split(":").map(Number);
    return { day: +day, hour, minutes: minutes as (30 | 0) };
};

/**
 * Offsets a block in 30 minute steps 
 * @param block The individual {@link BlockParts} of the block.
 * @param offset The number of 30 minute blocks to offset by.
 */
function offsetBlock(block: BlockParts, offset: number): BlockParts {
    let totalMinutes = block.hour * 60 + block.minutes + offset * 30;

    let newHour = ((Math.floor(totalMinutes / 60) - 1) % 24) + 1;
    let newMinutes = totalMinutes % 60 as (30 | 0);

    return { day: block.day, hour: newHour, minutes: newMinutes };
}