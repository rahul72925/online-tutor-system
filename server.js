import bodyParser from "body-parser";
import express from "express";
import { AuthRouter, ClassroomsRouter } from "./entities/index.js";
import "dotenv/config";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.use("/api/auth", AuthRouter);
app.use("/api/classroom", ClassroomsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
