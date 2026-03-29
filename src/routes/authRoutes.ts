import { Router } from "express";
import {
  loginController,
  profileController,
  signupController,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, profileController);

export default router;

