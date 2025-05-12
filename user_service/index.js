import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import database from "./config/database.js";
import userRoute from "./routes/user.route.js";
import path from "path";
import { consumeEvent, getconnection } from "./config/rabbitMq_config.js";
import { handleEvent } from "./utils/subscribe.js";

dotenv.config();
const app = express()
const PROT = process.env.PORT;

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/user", userRoute);

app.listen(PROT, async () => {
  database();
  await getconnection();
  await consumeEvent(handleEvent);
  console.log(`User service listen at ${PROT}`);
});
