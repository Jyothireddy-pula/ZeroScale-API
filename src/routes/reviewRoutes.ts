import { Router } from "express";
import {
  createReviewController,
  deleteReviewController,
  getReviewsForHostController,
  updateReviewController,
} from "../controllers/reviewController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createReviewController);
router.get("/:hostId", getReviewsForHostController);
router.put("/:id", authMiddleware, updateReviewController);
router.delete("/:id", authMiddleware, deleteReviewController);

export default router;

