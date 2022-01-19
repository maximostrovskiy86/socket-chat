import express from "express";
import logger from "morgan";
import cors from "cors";
import authRouter from "./routes/authRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);

export default app;
