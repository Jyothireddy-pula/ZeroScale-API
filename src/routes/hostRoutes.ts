import { Router } from "express";
import {
  createHostController,
  deleteHostController,
  getHostByIdController,
  getHostsByStateController,
  getHostsController,
  updateHostController,
} from "../controllers/hostController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createHostController);
router.get("/", getHostsController);
router.get("/:id", getHostByIdController);
router.get("/state/:state", getHostsByStateController);
router.put("/:id", authMiddleware, updateHostController);
router.delete("/:id", authMiddleware, deleteHostController);

export default router;

