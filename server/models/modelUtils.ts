/**
 * Keeps trying to run an sql query until it no longer recieved an SQLITE_BUSY error.
 * @param fn The query to keep trying.
 * @param retries Number of times to keep trying.
 * @param delay The delay between tries
 */
export async function keepTryingQuery<T>(
    fn: () => Promise<T>,
    retries = 5,
    delay = 250
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (e: any) {
            if (e.code === "SQLITE_BUSY" && i < retries - 1) {
                await new Promise((res) => setTimeout(res, delay));
            } else {
                throw e;
            }
        }
    }
    return await fn();
}
