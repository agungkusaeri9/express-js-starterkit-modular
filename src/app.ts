import express from "express";
import type { Application } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import { httpLogger } from "./middlewares/http-logger.middleware";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
