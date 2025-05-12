import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import database from "./config/database.js";
import messageRoute from "./routes/message.route.js";
import { getconnection } from "./config/rabbitMq_config.js";

dotenv.config();
const app = express()
const PROT = process.env.PORT;

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/message", messageRoute);

app.listen(PROT, async () => {
  database();
  await getconnection();
  console.log(`Message service listen at ${PROT}`);
});
