import { z } from "zod";

const dbSchema = z.object({
  DB_USERNAME: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("3306"),
  DB_NAME: z.string(),
  DATABASE_URL: z.string().url(),
});

const env = dbSchema.parse(process.env);

export const dbConfig = {
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  name: env.DB_NAME,
  url: env.DATABASE_URL,
};
