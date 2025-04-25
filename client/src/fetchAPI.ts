import { baseAPIUrl } from "./constants";

export default async function fetchAPI(url: string) {
    return fetch(baseAPIUrl + url).then(r => r.json())
}