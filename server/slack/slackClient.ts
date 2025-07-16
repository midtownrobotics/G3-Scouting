import { WebClient } from "@slack/web-api";
import { getSettingsSync } from "../storage";

const { token } = getSettingsSync().keys.slack;
const slackClient = new WebClient(token);

export default slackClient;