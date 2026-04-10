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
import { AssignmentType, DeployPayload } from "@shared/schemas/schedule";
import { lootboxes } from "@shared/schemas/game/lootboxes";

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

    if (!PRODUCTION) testCode();
  });
});

async function testCode() {

}