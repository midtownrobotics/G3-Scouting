/** Fetch API data.
 * @param url The API url. Not including `/api`.
 * @returns `null` if fetch error and {@link Response} otherwise.
 */
async function fetchAPI(url: string): Promise<Response | null> {
    try {
        return await fetch("/api".concat(url));
    } catch (err) {
        return null;
    };
}

/** Post data to API.
 * @param url The API url. Not including `/api`.
 * @param data The data to post
 * @returns `null` if fetch error and {@link Response} otherwise.
 */
export async function postAPI(url: string, data: any): Promise<Response | null> {
    try {
        return await fetch("/api".concat(url), {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch (err) {
        return null;
    };
}

/**
 * Fetches API data and parses it to JSON.
 * @param url The API url. Not including `/api`.
 * @returns Parsed JSON data.
 */
export async function fetchAPIJSON(url: string): Promise<unknown> {
    return fetchAPI(url).then(async (r) => r?.json())
}

export async function getApiStatus() {
    const result = await fetchAPI("/status")
    const text = await result?.text()
    
    return {
        ok: result != null && result.status == 200 && text == "ok",
        statusCode: result?.status
    }
}