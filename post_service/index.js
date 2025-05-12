import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import database from "./config/database.js";
import postRoute from "./routes/post.route.js";
import { getconnection } from "./config/rabbitMq_config.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();
const app = express()
const PROT = process.env.PORT;

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/post", postRoute);

app.listen(PROT, async () => {
  database();
  await connectRedis()
  await getconnection();
  console.log(`Post service listen at ${PROT}`);
});
