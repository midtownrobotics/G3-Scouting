import { PORT, PRODUCTION } from "@shared/constants";
import Form from "../shared/forms/Form";
import formComponents from "../shared/forms/FormComponents";
import syncDatabase from "./models/syncDatabase";
import { server } from "./routing/router";
import { LogColors } from "./utils";
import FormModel from "./models/forms/FormModel";

console.clear()
console.log(``)
console.log(`${LogColors.TX.Red} G³ ${LogColors.TX.White}Scout-o-matic`)
console.log(``)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Port ${PORT}`)
console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}${PRODUCTION ? "Production" : "Development"} mode`)
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
    form.addComponent(new formComponents.Information("You will answer a few personal quesitons."))
    form.addComponent(new formComponents.Number("What is your age?", "Age"))
    form.addComponent(new formComponents.MultipleChoice("What is your favorite color?", "Color", ["Blue", "Red", "Purple"]))
    form.addComponent(new formComponents.ShortResponse("What is your name?", "Name"))

    // FormModel.storeForm(form);
}