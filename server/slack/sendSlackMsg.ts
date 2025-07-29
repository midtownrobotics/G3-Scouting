import getSlackClient from "./slackClient";

export default async function sendSlackMessage(channel: string, text: string) {
    try {
        const res = await (await getSlackClient()).chat.postMessage({
            channel,
            text
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}