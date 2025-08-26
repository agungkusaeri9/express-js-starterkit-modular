import { z } from "zod";

export const createUserSchema = z
  .object({
    body: z.object({
      username: z.string().min(3, "Username minimal 3 karakter"),
      password: z.string().min(6, "Password minimal 6 karakter"),
      passwordConfirmation: z
        .string()
        .min(6, "Konfirmasi password minimal 6 karakter"),
    }),
  })
  .refine((data) => data.body.password === data.body.passwordConfirmation, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["passwordConfirmation"],
  });

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Id harus berupa angka"),
  }),
  body: z
    .object({
      username: z.string().min(3).optional(),
      password: z.string().min(6, "Password minimal 6 karakter").optional(),
      passwordConfirmation: z
        .string()
        .min(6, "Konfirmasi password minimal 6 karakter")
        .optional(),
    })
    .refine(
      (data) => {
        if (data.password) {
          return data.password === data.passwordConfirmation;
        }
        return true;
      },
      {
        message: "Password dan konfirmasi password tidak sama",
        path: ["passwordConfirmation"],
      }
    ),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Id harus berupa angka"),
  }),
});
