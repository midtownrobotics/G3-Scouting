import syncDatabase from "./models/syncDatabase";
import { server } from "./routing/router";
import { BASE_API_URL, ENABLE_AUTH, PORT, PRODUCTION } from "@shared/constants";
import { LogColors } from "./utils";
import Form from "../shared/forms/Form";
import formComponents, { FormComponent, Information, SectionBreak } from "../shared/forms/FormComponents";
import FormModel from "./models/forms/FormModel";

console.clear()
console.log(``)
console.log(`${LogColors.TX.Red} G³ ${LogColors.TX.White}Scout-o-matic`)
console.log(``)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Port ${PORT}`)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}${PRODUCTION ? "Production" : "Development"} mode`)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Auth ${ENABLE_AUTH ? "enabled" : "disabled"}`)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}API backend: "${BASE_API_URL}"`)
console.log(``)
console.log(`Started — ${LogColors.TX.Blue}${new Date().toLocaleString()}${LogColors.TX.White}`)
console.log(``)

syncDatabase().then(() => {
    server.listen(PORT, () => {
        testCode()
    });
})

async function testCode() {
    const form = new Form("Test Form");

    form.addComponent(new formComponents.SectionBreak("Colors"))
    form.addComponent(new formComponents.Information("You will answer a few color related quesitons."))
    form.addComponent(new formComponents.MultipleChoice("What is your favorite color?", "Fav Color", ["Blue", "Red", "Purple"]))
    form.addComponent(new formComponents.MultipleChoice("What is your MOSTEST LESASTEST favorite color?", "Least Fav Color", ["Blue", "Red", "Purple"]))

    // FormModel.storeForm(form);
}