import { WebClient } from "@slack/web-api"
import { getSettingsSync } from "./storage"
import express from "express";
import UserModel from "./models/UserModel";

const router = express.Router();

const slack = new WebClient(getSettingsSync().keys.slack)

/**
 * Sends a message to a slack channel.
 * @param channel The channel id or user id to send the message.
 * @param text The message to send.
 */
export function sendMessage(channel: string, text: string) {
    try {
        slack.chat.postMessage({ text, channel })
    } catch (err) {
        console.log(JSON.stringify((err as any).data.response_metadata.acceptedScopes))
    }
}

const linkCooldowns = new Map<string, number>(); // Maps user ID to last attempt timestamp
const COOLDOWN_MS = 30 * 1000; // 30-second cooldown

const LINK_ERROR_MSG = "Wrong ID or link code entered. Open the settings page on the software for linking instructions.";

router.post("/slack/link", async (req, res) => {
    const { user_id, text } = req.body;

    const lastAttempt = linkCooldowns.get(user_id);
    const now = Date.now();
    linkCooldowns.set(user_id, now)

    if (lastAttempt && now - lastAttempt < COOLDOWN_MS) return res.json({ text: "Please wait a few seconds before retrying the link process.", response_type: "ephemeral" });
    
    if (!text) return res.json({ text: 'Usage: "/link [User ID] [Link code]"', response_type: "ephemeral" });

    const [userDbId, slackLinkCode] = text.split(" ") as string[]

    if ((!userDbId && parseInt(userDbId) !== 0) || !slackLinkCode) return res.json({ text: LINK_ERROR_MSG, response_type: "ephemeral" });

    const user = await UserModel.findOne({ where: { id: userDbId, slackLinkCode } })

    if (!user) return res.json({ text: LINK_ERROR_MSG, response_type: "ephemeral" });

    user.update({ slackId: user_id })

    return res.json({ text: `Account linked succesfully! Hello "${user.username}"!`, response_type: "ephemeral" });
});

export default router;