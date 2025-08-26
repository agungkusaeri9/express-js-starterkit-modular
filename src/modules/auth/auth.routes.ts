import { Router } from "express";
import { login, logout, refreshToken } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";
import { loginSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshToken);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Ini data profile", user: (req as any).user });
});

export default router;
