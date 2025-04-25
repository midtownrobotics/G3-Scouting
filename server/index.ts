import { PORT } from "./constants";
import syncDatabase from "./models/syncDatabase";
import { server } from "./routing/router";

syncDatabase().then(() => {
    server.listen(PORT);
    console.log(`listening on port ${PORT}! enjoy!`);
})