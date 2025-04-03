import schedule from 'node-schedule';
import UserModel from './models/UserModel';
import { getCurrentScoutingBlock } from './blockManager';

export default function startReminderSchedule() {
    schedule.scheduleJob('20,50 * * * *', sendMessages);
}

async function sendMessages() {
    const users = await UserModel.findAll()
    const nextBlock = await getCurrentScoutingBlock(1);
    const block = await getCurrentScoutingBlock();

    console.log("sending msgs")

    if (!users || !block || !nextBlock) return;

    users.forEach((u) => {
        const status = u.assignments?.find((a) => a.time == block)?.status;
        if (!status) return;
        const nextStatus = u.assignments?.find((a) => a.time == nextBlock)?.status;
        if (!nextStatus || status == nextStatus) return;
        u.sendSlackMessage(`In 10mins you will be ${nextStatus == "scouting" ? "scouting." : "on break!!"}`);
    })
}