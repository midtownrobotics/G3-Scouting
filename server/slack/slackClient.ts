import { WebClient } from "@slack/web-api";
import { getSettingsValue } from "../other/settings";

let client: WebClient | undefined;
let lastToken: string | undefined;

export async function getSlackClient() {
    const token = await getSettingsValue("slackToken");

    if (client !== undefined && lastToken === token) return client;

    client = new WebClient(token)

    return client;
}

export default getSlackClient;