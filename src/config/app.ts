import { z } from "zod";

const appSchema = z.object({
  PORT: z.string().default("6000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const env = appSchema.parse(process.env);

export const appConfig = {
  port: Number(env.PORT),
  env: env.NODE_ENV,
};
