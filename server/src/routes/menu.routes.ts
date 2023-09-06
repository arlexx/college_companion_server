import express from "express";
import { upload } from "../middleware/multer.config";
import {
  createMenu,
  deleteMenu,
  getMenus,
  updateMenu,
} from "../controllers/menu.controller";

const router = express.Router();

router.post("/create", createMenu);
router.get("/", getMenus);
router.put("/", updateMenu);
router.delete("/", deleteMenu);

export default router;
