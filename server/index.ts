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
import Form, { FormType } from "@shared/forms/Form";
import FormModel from "./models/forms/FormModel";
import { scoreUnscoredMatches } from "./data/reliability/scoreUnscoredMatches";
import formComponents from "@shared/forms/FormComponents";
import fetchData from "./data/virtualDataRecorder/fetchData";
import { DataType, Equation, EquationComponentType, Operator } from "@shared/schemas/virtualDataRecorder";
import { getTeamData } from "./externalApis/statbotics/statbotics";
import doOperation from "./data/virtualDataRecorder/doOperation";
import { evaluateEquation } from "./data/virtualDataRecorder/evaluateEquation";
import VirtualDataEquationModel from "./models/forms/VirtualDataEquationModels";
import updateAllVdrData from "./data/virtualDataRecorder/updateAllVdrData";
import { getCheckedInUsers } from "./scheduling/checkIn";
import deploySchedules from "./scheduling/deploySchedules";
import { AssignmentType } from "@shared/schemas/schedule";

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
            UserModel.addUser("admin", "password", "Default User", Permission.ADMIN);
        }

        // const settings: Settings = await getSettings();
        // if (!settings.permissionLevels.find(p => p.blacklist.length == 0)) {
        //     settings.permissionLevels.push({ name: "admin", blacklist: [], id: 0 });
        //     writeSettings(settings);
        // }

        if (!PRODUCTION) testCode();
    });
});

async function testCode() {

    // (await UserModel.findByPk(5))?.set({ tokens: 200 });
    // (await UserModel.findByPk(26))?.set({ tokens: 200 });
    // (await UserModel.findByPk(23))?.set({ tokens: 200 });
    // (await UserModel.findByPk(7))?.set({ tokens: 200 });
    // (await UserModel.findByPk(10))?.set({ tokens: 200 });
    // (await UserModel.findByPk(14))?.set({ tokens: 200 });

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

    // const users = await UserModel.findAll();

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

    // const insertCsvDataIntoDb = () => {
    //     const ppData = parse(fs.readFileSync(path.join(__dirname, "/../data.csv")).toString(), {
    //         header: true
    //     });

    //     ppData.data.forEach((row: any, i) => {
    //         const team = parseInt(row.TeamNumber);
    //         const match = parseInt(row.MatchNumber);
    //         const userId = parseInt(row.UserId);
    //         const submittedAt = row.SubmittedAt;
    //         const responses = Object.entries(row)
    //             .filter(e => e[0] !== "TeamNumber" && e[0] !== "MatchNumber" && e[0] !== "UserId" && e[0] !== "SubmittedAt")
    //             .map(r => ({ question: r[0], response: r[1] as string }));

    //         FormResponseByTeamModel.create({
    //             match,
    //             userId,
    //             formId: "Quantitative",
    //             team,
    //             responses,
    //             submittedAt
    //         });
    //     });
    // };
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

    // VirtualDataEquationModel.addEquation(
    //     "PPG",
    //     [
    //         {
    //             componentType: EquationComponentType.DATA,
    //             data: {
    //                 type: DataType.SOM_MATCH_TEAM,
    //                 path: "Quantitative_Form-FuelScored-2"
    //             }
    //         },
    //         {
    //             componentType: EquationComponentType.OPERATOR,
    //             operator: Operator.ADD
    //         },
    //         {
    //             componentType: EquationComponentType.DATA,
    //             data: {
    //                 type: DataType.SOM_MATCH_TEAM,
    //                 path: "Quantitative_Form-TeleopFuelScore-7"
    //             }
    //         }
    //     ]
    // );

    // updateAllVdrData();

    // setInterval(() => {
    //     console.log(getCheckedInUsers());
    // }, 1000);

    const schedule = {
  "assignments": [
    {
      "color": "#00f5d4",
      "name": "Scouting",
      "type": "Assigned",
      "id": 2961251404189
    },
    {
      "color": "#adb5bd",
      "name": "Break",
      "type": "Break",
      "id": 5309033439831
    },
    {
      "color": "#48cae4",
      "name": "Pit Scouting",
      "type": "Other",
      "id": 3453385008862
    },
    {
      "color": "#4361ee",
      "name": "In Stands",
      "type": "Break",
      "id": 2802754416809
    },
    {
      "color": "#ef233c",
      "name": "Drive Team",
      "type": "Other",
      "id": 1560157888921
    },
    {
      "color": "#f4d35e",
      "name": "Meal",
      "type": "Break",
      "id": 2645100452462
    },
    {
      "color": "#fb8500",
      "name": "Pit Crew",
      "type": "Pit",
      "id": 5089747908747
    },
    {
      "color": "#6a0572",
      "name": "Load Out",
      "type": "Other",
      "id": 8381094320374
    },
    {
      "color": "#f72585",
      "name": "On Field",
      "type": "Other",
      "id": 8899391642592
    },
    {
      "color": "#7b2d8b",
      "name": "Lead Scouting",
      "type": "Other",
      "id": 5894498626988
    },
    {
      "color": "#2d3a3a",
      "name": "Blank",
      "type": "Other",
      "id": 3808074611645
    },
    {
      "color": "#57cc99",
      "name": "Service Crew",
      "type": "Pit",
      "id": 8437586875258
    }
  ],
  "schedules": [
    {
      "userId": 1,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 3808074611645
        }
      ]
    },
    {
      "userId": 2,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 3,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 4,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3453385008862
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5894498626988
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 5,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 6,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 7,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 8,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 9,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 10,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 11,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 3808074611645
        }
      ]
    },
    {
      "userId": 12,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 13,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 14,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 15,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 16,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 17,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 1560157888921
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 18,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 20,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 21,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 22,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 23,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 8899391642592
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 24,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 25,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 26,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 27,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 3808074611645
        }
      ]
    },
    {
      "userId": 28,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 29,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 5309033439831
        }
      ]
    },
    {
      "userId": 30,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 31,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 32,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 36,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 37,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 38,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 8437586875258
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 39,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 40,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 3808074611645
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 41,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 44,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 5089747908747
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    },
    {
      "userId": 45,
      "assignments": [
        {
          "blockId": 1773576000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773577800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773579600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773581400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773583200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773585000000,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 1773586800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773588600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773590400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773592200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773594000000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773595800000,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 1773597600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773599400000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773601200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773603000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773604800000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773606600000,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 1773608400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773610200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773612000000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773613800000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773615600000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773617400000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 1773619200000,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2418346900329,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2657989313790,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2249876053309,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2147095892462,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2097752929272,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2799942602415,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2581465847684,
          "assignmentId": 5309033439831
        },
        {
          "blockId": 2771738229213,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2096802675034,
          "assignmentId": 2961251404189
        },
        {
          "blockId": 2686930097954,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2221144752043,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2792084909410,
          "assignmentId": 2645100452462
        },
        {
          "blockId": 2646878837315,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2868514080179,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2867162484037,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2903549363086,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2946559732801,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2234858985733,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2507460163663,
          "assignmentId": 2802754416809
        },
        {
          "blockId": 2196110645852,
          "assignmentId": 8381094320374
        },
        {
          "blockId": 2626420839224,
          "assignmentId": 8381094320374
        }
      ]
    }
  ],
  "blocks": [
    {
      "date": "2026-03-14",
      "time": 480,
      "id": 1773576000000
    },
    {
      "date": "2026-03-14",
      "time": 510,
      "id": 1773577800000
    },
    {
      "date": "2026-03-14",
      "time": 540,
      "id": 1773579600000
    },
    {
      "date": "2026-03-14",
      "time": 570,
      "id": 1773581400000
    },
    {
      "date": "2026-03-14",
      "time": 600,
      "id": 1773583200000
    },
    {
      "date": "2026-03-14",
      "time": 630,
      "id": 1773585000000
    },
    {
      "date": "2026-03-14",
      "time": 660,
      "id": 1773586800000
    },
    {
      "date": "2026-03-14",
      "time": 690,
      "id": 1773588600000
    },
    {
      "date": "2026-03-14",
      "time": 720,
      "id": 1773590400000
    },
    {
      "date": "2026-03-14",
      "time": 750,
      "id": 1773592200000
    },
    {
      "date": "2026-03-14",
      "time": 780,
      "id": 1773594000000
    },
    {
      "date": "2026-03-14",
      "time": 810,
      "id": 1773595800000
    },
    {
      "date": "2026-03-14",
      "time": 840,
      "id": 1773597600000
    },
    {
      "date": "2026-03-14",
      "time": 870,
      "id": 1773599400000
    },
    {
      "date": "2026-03-14",
      "time": 900,
      "id": 1773601200000
    },
    {
      "date": "2026-03-14",
      "time": 930,
      "id": 1773603000000
    },
    {
      "date": "2026-03-14",
      "time": 960,
      "id": 1773604800000
    },
    {
      "date": "2026-03-14",
      "time": 990,
      "id": 1773606600000
    },
    {
      "date": "2026-03-14",
      "time": 1020,
      "id": 1773608400000
    },
    {
      "date": "2026-03-14",
      "time": 1050,
      "id": 1773610200000
    },
    {
      "date": "2026-03-14",
      "time": 1080,
      "id": 1773612000000
    },
    {
      "date": "2026-03-14",
      "time": 1110,
      "id": 1773613800000
    },
    {
      "date": "2026-03-14",
      "time": 1140,
      "id": 1773615600000
    },
    {
      "date": "2026-03-14",
      "time": 1170,
      "id": 1773617400000
    },
    {
      "date": "2026-03-14",
      "time": 1200,
      "id": 1773619200000
    },
    {
      "date": "2026-03-15",
      "time": 480,
      "id": 2418346900329
    },
    {
      "date": "2026-03-15",
      "time": 510,
      "id": 2657989313790
    },
    {
      "date": "2026-03-15",
      "time": 540,
      "id": 2249876053309
    },
    {
      "date": "2026-03-15",
      "time": 570,
      "id": 2147095892462
    },
    {
      "date": "2026-03-15",
      "time": 600,
      "id": 2097752929272
    },
    {
      "date": "2026-03-15",
      "time": 630,
      "id": 2799942602415
    },
    {
      "date": "2026-03-15",
      "time": 660,
      "id": 2581465847684
    },
    {
      "date": "2026-03-15",
      "time": 690,
      "id": 2771738229213
    },
    {
      "date": "2026-03-15",
      "time": 720,
      "id": 2096802675034
    },
    {
      "date": "2026-03-15",
      "time": 750,
      "id": 2686930097954
    },
    {
      "date": "2026-03-15",
      "time": 780,
      "id": 2221144752043
    },
    {
      "date": "2026-03-15",
      "time": 810,
      "id": 2792084909410
    },
    {
      "date": "2026-03-15",
      "time": 840,
      "id": 2646878837315
    },
    {
      "date": "2026-03-15",
      "time": 870,
      "id": 2868514080179
    },
    {
      "date": "2026-03-15",
      "time": 900,
      "id": 2867162484037
    },
    {
      "date": "2026-03-15",
      "time": 930,
      "id": 2903549363086
    },
    {
      "date": "2026-03-15",
      "time": 960,
      "id": 2946559732801
    },
    {
      "date": "2026-03-15",
      "time": 990,
      "id": 2234858985733
    },
    {
      "date": "2026-03-15",
      "time": 1020,
      "id": 2507460163663
    },
    {
      "date": "2026-03-15",
      "time": 1050,
      "id": 2196110645852
    },
    {
      "date": "2026-03-15",
      "time": 1080,
      "id": 2626420839224
    }
  ]
}

    // deploySchedules(schedule as any);
}