export function getCurrentBlockId() {
    const now = new Date();
    const msPer30Min = 30 * 60 * 1000;
  
    return Math.floor(now.getTime() / msPer30Min) * msPer30Min;
}