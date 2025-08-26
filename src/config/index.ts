import dotenv from "dotenv";
dotenv.config();

import { appConfig } from "./app";
import { dbConfig } from "./db";
import { jwtConfig } from "./jwt";

export const config = {
  app: appConfig,
  db: dbConfig,
  jwt: jwtConfig,
};
