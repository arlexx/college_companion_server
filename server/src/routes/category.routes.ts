import express from "express";
import { upload } from "../middleware/multer.config";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  getCategory,
  getSubCategories,
  getSubCategory,
  updateCategory,
} from "../controllers/category.controller";

const router = express.Router();

router.post("/create", upload.single("image"), createCategory);
router.post("/createsub", createSubCategory);

router.put("/updatecat", upload.single("image"), updateCategory);

router.delete("/deletecat", deleteCategory);
router.delete("/deletesubcat", deleteSubCategory);

router.get("/", getCategories);
router.get("/sub", getSubCategories);
router.get("/:id", getCategory);
router.post("/sub", getSubCategory);

export default router;
