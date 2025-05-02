import syncDatabase from "./models/syncDatabase";
import { server } from "./routing/router";
import { BASE_API_URL, ENABLE_AUTH, PORT, PRODUCTION } from "@shared/constants";
import { LogColors } from "./utils";

syncDatabase().then(() => {
    server.listen(PORT);
    console.clear()
    console.log(``)
    console.log(`${LogColors.TX.Red} G³ ${LogColors.TX.White}Scout-o-matic`)
    console.log(``)
    console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Port ${PORT}`)
    console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}${PRODUCTION ? "Production" : "Development"} mode`)
    console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}Auth ${ENABLE_AUTH ? "enabled" : "disabled"}`)
    console.log(` ${LogColors.TX.Red}➜  ${LogColors.TX.White}API backend: "${BASE_API_URL}"`)
})