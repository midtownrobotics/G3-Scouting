import { z } from "zod";

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
 * Fetches API data and parses it.
 * @param url The API url. Not including `/api`.
 * @param type The Zod type to use for JSON parsing.
 * @returns Parsed data or `undefinied` if parsing failed.
 */
export async function fetchAPIJSON<T extends z.ZodType>(url: string, type: T): Promise<z.infer<T> | undefined> {
    const data =  fetchAPI(url).then(async (r) => r?.json());
    const parsed = type.safeParse(data);
    if (parsed.success) return parsed.data;
    return undefined;
}

export async function getApiStatus() {
    const result = await fetchAPI("/status")
    const text = await result?.text()
    
    return {
        ok: result != null && result.status == 200 && text == "ok",
        statusCode: result?.status
    }
}