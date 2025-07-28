import cron from 'node-cron';
import UserModel from '../models/users/UserModel';
import { getCurrentBlockId } from '../scheduling/timeUtils';
import sendSlackMessage from './sendSlackMsg';

export function scheduleReminders() {
    cron.schedule('24,29,50,59 * * * *', async () => {
        const nextId = getCurrentBlockId(1);
        const nextTime = new Date(nextId).toLocaleTimeString(undefined, { timeStyle: "short" });

        const users = await UserModel.findAll();
        for (const user of users) {
            if (user.slackId == null) continue;
            const current = await user.getCurrentAssignment();
            const next = await user.getAssignment(nextId);
            if (current?.id !== undefined && current?.id !== next?.id) {
                sendSlackMessage(user.slackId, `REMINDER: At ${nextTime}, your assignment will switch to "${next?.name}".`);
            }
        }
    });
}