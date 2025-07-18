import { PORT, PRODUCTION } from "@shared/config";
import syncDatabase from "./models/syncDatabase";
import UserModel from "./models/users/UserModel";
import { server } from "./routing/router";
import { scheduleReminders } from "./slack/shiftReminders";
import { getSettings, writeSettings } from "./storage";
import { Settings } from "./types";
import { LogColors } from "./utils";
import Form from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import FormModel from "./models/forms/FormModel";

console.clear();
console.log(``);
console.log(`${LogColors.TX.Red} G³ ${LogColors.TX.White}Scout-o-matic`);
console.log(``);
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Port ${PORT}`);
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}${PRODUCTION ? "Production" : "Development"} mode`);
console.log(``);
console.log(`Started — ${LogColors.TX.Blue}${new Date().toLocaleString()}${LogColors.TX.White}`);
console.log(``);

syncDatabase().then(() => {
    server.listen(PORT, async () => {
        scheduleReminders();

        const allUsers = await UserModel.findAll();
        if (allUsers.length == 0 || !allUsers.find((user) => user.permissionId === 0)) {
            UserModel.addUser("admin", "password", 0, true);
        }

        const settings: Settings = await getSettings();
        if (!settings.permissionLevels.find(p => p.blacklist.length == 0)) {
            settings.permissionLevels.push({ name: "admin", blacklist: [], id: 0 });
            writeSettings(settings);
        }

        testCode();
    });
});

async function testCode() {
    const form = new Form("Quantitative", "A quantitative scouting form.");

    form.addComponent(new formComponents.SectionBreak("Autonomous"))
    form.addComponent(new formComponents.Number("L1", "AutoL1"))
    form.addComponent(new formComponents.Number("L2", "AutoL2"))
    form.addComponent(new formComponents.Number("L3", "AutoL3"))
    form.addComponent(new formComponents.Number("L4", "AutoL4"))
    form.addComponent(new formComponents.SectionBreak("Match"))
    form.addComponent(new formComponents.Number("L1", "MatchL1"))
    form.addComponent(new formComponents.Number("L2", "MatchL2"))
    form.addComponent(new formComponents.Number("L3", "MatchL3"))
    form.addComponent(new formComponents.Number("L4", "MatchL4"))
    form.addComponent(new formComponents.Number("Barge", "MatchBarge"))
    form.addComponent(new formComponents.Number("Processor", "Processor"))
    form.addComponent(new formComponents.SectionBreak("Endgame"))
    form.addComponent(new formComponents.MultipleChoice("Robot Climbing", "Climbing", ["None", "Park", "Shallow", "Deep"]))
    form.addComponent(new formComponents.SectionBreak("Post-Game"))
    form.addComponent(new formComponents.MultipleChoice("Can the robot dealgify?", "Dealgify", ["No", "Yes"]))
    form.addComponent(new formComponents.ShortResponse("Additional Notes", "Notes"))

    FormModel.storeForm(form);

    // console.log(await sendSlackMessage("U096JVA9VEV", "Hello from your bot!"));
}