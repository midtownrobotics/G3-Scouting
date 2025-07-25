import { PORT, PRODUCTION } from "@shared/config";
import Form from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import FormModel from "./models/forms/FormModel";
import FormResponseByTeamModel from "./models/forms/FormResponseModel";
import syncDatabase from "./models/syncDatabase";
import UserModel from "./models/users/UserModel";
import { server } from "./routing/router";
import { scheduleReminders } from "./slack/shiftReminders";
import { getSettings, writeSettings } from "./storage";
import { Settings } from "./types";
import { LogColors, numberParser } from "./utils";
import { parse } from "papaparse";
import fs from "fs";
import path from "path";
import { getAllMatches } from "./externalApis/tba/tba";
import { scoreAllForms } from "./data/reliability/scoreUnscoredMatches";

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

    form.addComponent(new formComponents.SectionBreak("Autonomous"));
    form.addComponent(new formComponents.Number("L1", "AutoL1", { type: "tba", path: "score_breakdown.{$A}.autoReef.trough" }));
    form.addComponent(new formComponents.Number("L2", "AutoL2", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_botRowCount" }));
    form.addComponent(new formComponents.Number("L3", "AutoL3", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_midRowCount" }));
    form.addComponent(new formComponents.Number("L4", "AutoL4", { type: "tba", path: "score_breakdown.{$A}.autoReef.tba_topRowCount" }));
    form.addComponent(new formComponents.SectionBreak("Match"));
    form.addComponent(new formComponents.Number("L1", "MatchL1", { type: "tba", path: "score_breakdown.{$A}.teleopReef.trough" }));
    form.addComponent(new formComponents.Number("L2", "MatchL2", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_botRowCount" }));
    form.addComponent(new formComponents.Number("L3", "MatchL3", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_midRowCount" }));
    form.addComponent(new formComponents.Number("L4", "MatchL4", { type: "tba", path: "score_breakdown.{$A}.teleopReef.tba_topRowCount" }));
    form.addComponent(new formComponents.Number("Barge", "MatchBarge"));
    form.addComponent(new formComponents.Number("Processor", "Processor"));
    form.addComponent(new formComponents.SectionBreak("Endgame"));
    form.addComponent(new formComponents.MultipleChoice("Robot Climbing", "Climbing", ["None", "Park", "Shallow", "Deep"]));
    form.addComponent(new formComponents.SectionBreak("Post-Game"));
    form.addComponent(new formComponents.MultipleChoice("Can the robot dealgify?", "Dealgify", ["No", "Yes"]));
    form.addComponent(new formComponents.ShortResponse("Additional Notes", "Notes"));

    FormModel.storeForm(form);

    form.updateResponseData(await FormResponseByTeamModel.findAll({ where: { formId: form.id } }));
    console.log(form.getResponseData()?.responses.length!);
    // console.log(form.getResponseData(25)?.responses.length!);
    console.log(form.getResponseData(50)?.responses.length!);
    // console.log(form.getResponseData(75)?.responses.length!);
    console.log(form.getResponseData(90)?.responses.length!);
    // console.log(form.getResponseData(95)?.responses.length!);
    // if (!responseData) return;

    // await scoreAllForms();

    // console.log(await getAllMatches());
    // console.log(await sendSlackMessage("U096JVA9VEV", "Hello from your bot!"));

    const insertCsvDataIntoDb = () => {
        const ppData = parse(fs.readFileSync(path.join(__dirname, "/../data.csv")).toString(), {
            header: true
        });

        ppData.data.forEach((row: any) => {
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
}