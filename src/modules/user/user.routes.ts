import { Router } from "express";
import * as userController from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.schema";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/", validate(createUserSchema), userController.create);
router.get("/", userController.getAll);
router.get("/me", userController.me);
router.get("/:id", validate(userIdSchema), userController.getById);
router.patch("/:id", validate(updateUserSchema), userController.update);
router.delete("/:id", validate(userIdSchema), userController.remove);

export default router;
