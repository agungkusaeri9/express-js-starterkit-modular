import { z } from "zod";

const jwtSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET wajib diisi"),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const env = jwtSchema.parse(process.env);

export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};
