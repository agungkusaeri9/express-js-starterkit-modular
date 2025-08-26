import { Router } from "express";
import * as authController from "./auth.controller";
import { authMiddleware } from "./auth.middleware";
import { loginSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
