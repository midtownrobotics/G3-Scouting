import { BASE_API_URL } from "@shared/constants";

/** Fetch API data.
 * @param url The API url.
 * @returns `null` if fetch error and {@link Response} otherwise.
 */
async function fetchAPI(url: string): Promise<Response | null> {
    try { 
        return await fetch(BASE_API_URL.concat(url));
    } catch(err) {
        return null;
    };
}

/** Post data to API.
 * @param url The API url.
 * @param data The data to post
 * @returns `null` if fetch error and {@link Response} otherwise.
 */
export async function postAPI(url: string, data: any): Promise<Response | null> {
    try {
        return await fetch(BASE_API_URL.concat(url), {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch(err) {
        return null;
    };
}

/**
 * Fetches API data and parses it to JSON.
 * @param url The API url.
 * @returns Parsed JSON data.
 */
export async function fetchAPIJSON(url: string): Promise<unknown> {
    return fetchAPI(url).then(async (r) => r?.json())
}

/**
 * Checks if the API is reachable.
 * @returns `boolean` Whether client can reach the API.
 */
export async function getConnected(): Promise<boolean> {
    const result = await fetchAPI("/status")
    const text = await result?.text()
    return (result != null && result.status == 200 && text == "ok")
}