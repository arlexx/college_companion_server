import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/", loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", logoutAdmin);

export default router;
