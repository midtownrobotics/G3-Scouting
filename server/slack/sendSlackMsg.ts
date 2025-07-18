import UserModel from "../models/users/UserModel";
import slackClient from "./slackClient";

export default async function sendSlackMessage(channel: string, text: string) {
    try {
        const res = await slackClient.chat.postMessage({
            channel,
            text
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}