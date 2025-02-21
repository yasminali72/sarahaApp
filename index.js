import path from "node:path";
import bootstrap from "./src/app.controller.js";
import express from "express";
import * as dotenv from "dotenv";
import { sendEmail } from "./src/utils/email/send.email.js";


dotenv.config({ path: path.join("./src/config/.env.prod") });
const app = express();
const port = process.env.PORT || 8000;

bootstrap(app, express);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
