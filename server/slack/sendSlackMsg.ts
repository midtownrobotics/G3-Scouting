import slackClient from "./slackClient";

export default async function sendSlackMessage(userId: string, text: string) {
    try {
        const res = await slackClient.chat.postMessage({
            channel: userId,
            text: text,
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}