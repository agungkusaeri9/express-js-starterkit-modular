import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];
