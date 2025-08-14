/** 
 * Gets the current block ID, or a different one relative to the current. 
 * @param offset The number of blocks to offset by, 0 being the current block. `1` -> next block. `-1` -> previous block.
 */
export function getCurrentBlockId(offset?: number) {
    const msPer30Min = 30 * 60 * 1000;
    const time = Date.now() + ((offset ?? 0) * msPer30Min);
    return Math.floor(time / msPer30Min) * msPer30Min;
}