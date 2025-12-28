import { PORT, PRODUCTION } from "@shared/config";
import { Permission } from "@shared/permissions";
import fs from "fs";
import { parse } from "papaparse";
import path from "path";
import FormResponseByTeamModel from "./models/forms/FormResponseModels";
import syncDatabase from "./models/syncDatabase";
import UserModel from "./models/users/UserModel";
import { server } from "./routing/router";
import { scheduleReminders } from "./slack/shiftReminders";
import { LogColors } from "./utils";
import { sendNotification } from "./other/notifications";
import getTokensFromAccuracy from "./game/getTokensFromAccuracy";
import scoreAllianceData from "./data/reliability/scoreResponse";
import { getMatchData } from "./externalApis/tba/tba";
import Form from "@shared/forms/Form";
import FormModel from "./models/forms/FormModel";
import { scoreUnscoredMatches } from "./data/reliability/scoreUnscoredMatches";
if (PRODUCTION) {
    require('module-alias/register');
}

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
        if (allUsers.length === 0 || !allUsers.some((user) => user.permission === Permission.ADMIN)) {
            UserModel.addUser("admin", "password", Permission.ADMIN, true);
        }

        // const settings: Settings = await getSettings();
        // if (!settings.permissionLevels.find(p => p.blacklist.length == 0)) {
        //     settings.permissionLevels.push({ name: "admin", blacklist: [], id: 0 });
        //     writeSettings(settings);
        // }

        testCode();
    });
});

async function testCode() {

    // const form = (await FormModel.getForm("Quantitative", true));
    // console.time("Scoring");
    // if (form) await scoreUnscoredMatches(form);
    // console.timeEnd("Scoring");

    // sendNotification("You won 8423 BoyleBucks in match 54!", "game", new Date("10/16/2025 9:00 PM"), 1, 1);
    // sendNotification("Lunch is in the table!", "userMessaging", new Date("10/17/2025 9:00 PM"), 99);
    // sendNotification("ALERT ALERT ALERT", "game", new Date("10/16/2025 9:00 PM"), 99);

    // const gray = await UserModel.findOne({ where: {username: "gjackson"} });

    // gray?.update({ tokens: 90 });
    // gray?.update({ tokens: 10000 });

    const users = await UserModel.findAll();

    // users.forEach(async u => {
    //     const matches = await FormResponseByTeamModel.findAll({ where: { formId: "Quantitative", userId: u.id }});

    //     let xp = matches.length * 20;
    //     matches.forEach(m => xp += getTokensFromAccuracy(m.accuracyScore));

    //     u.update({xp});
    // })

    // const form = new Form(FormType.TEAM, "Quantitative", "A quantitative scouting form.");

    // form.addComponent(new formComponents.SectionBreak("Autonomous"));
    // form.addComponent(new formComponents.Number("L1", "AutoL1", { type: "tba", path: "score_breakdown.{$A}.autoReef.trough" }));
    // form.addComponent(new formComponents.Number("L2", "AutoL2", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_botRowCount" }));
    // form.addComponent(new formComponents.Number("L3", "AutoL3", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_midRowCount" }));
    // form.addComponent(new formComponents.Number("L4", "AutoL4", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_topRowCount" }));
    // form.addComponent(new formComponents.SectionBreak("Match"));
    // form.addComponent(new formComponents.Number("L1", "MatchL1", { type: "tba", path: "score_breakdown.{$A}.teleopReef.trough" }));
    // form.addComponent(new formComponents.Number("L2", "MatchL2", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_botRowCount" }));
    // form.addComponent(new formComponents.Number("L3", "MatchL3", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_midRowCount" }));
    // form.addComponent(new formComponents.Number("L4", "MatchL4", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_topRowCount" }));
    // form.addComponent(new formComponents.Number("Barge", "MatchBarge"));
    // form.addComponent(new formComponents.Number("Processor", "Processor"));
    // form.addComponent(new formComponents.SectionBreak("Endgame"));
    // form.addComponent(new formComponents.MultipleChoice("Robot Climbing", "Climbing", ["None", "Park", "Shallow", "Deep"]));
    // form.addComponent(new formComponents.SectionBreak("Post-Game"));
    // form.addComponent(new formComponents.MultipleChoice("Can the robot dealgify?", "Dealgify", ["No", "Yes"]));
    // form.addComponent(new formComponents.ShortResponse("Additional Notes", "Notes"));

    // FormModel.storeForm(form);

    // console.log(await sendSlackMessage("U096JVA9VEV", "Hello from your bot!"));

    const insertCsvDataIntoDb = () => {
        const ppData = parse(fs.readFileSync(path.join(__dirname, "/../data.csv")).toString(), {
            header: true
        });

        ppData.data.forEach((row: any, i) => {
            const team = parseInt(row.TeamNumber);
            const match = parseInt(row.MatchNumber);
            const userId = parseInt(row.UserId);
            const submittedAt = row.SubmittedAt;
            const responses = Object.entries(row)
                .filter(e => e[0] !== "TeamNumber" && e[0] !== "MatchNumber" && e[0] !== "UserId" && e[0] !== "SubmittedAt")
                .map(r => ({ question: r[0], response: r[1] as string }));

            FormResponseByTeamModel.create({
                match,
                userId,
                formId: "Quantitative",
                team,
                responses,
                submittedAt
            });
        });
    };
    // insertCsvDataIntoDb();

    // console.log((await getEventStatus())?.matches)

    // return;

    // const things = (await FormResponseByTeamModel.findAll()).filter(a => {
    //     const date = new Date(a.submittedAt)
    //     return date.getMonth() < 8 || date.getDate() !== 3;
    // });

    // things.forEach(t => console.log(t.submittedAt));
    // things.forEach(t => t.destroy());

    // const users = await UserModel.findAll();

    // users.forEach(u => {
    //     if (u.permission == Permission.SCOUT) {
    //         u.set("permission", Permission.DATA);
    //         u.save();
    //     }
    // });
}