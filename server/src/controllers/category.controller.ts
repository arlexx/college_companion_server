import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/error";
import { Category, Subcategory, Menu } from "../models/menu.model";
import cloudinary from "../middleware/cloudinary.config";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Swad Menu/Categories",
        crop: "fill",
        gravity: "auto",
        fetch_format: "auto",
        quality: "auto",
        responsive: true,
        object_fit: "cover",
        max_bytes: 1000000,
      });

      let category = new Category({
        name: req.body.name,
        imgUrl: result.secure_url,
        cloudinary_id: result.public_id,
      });
      await category.save();
      res.json(category);
    } else {
      throw new Error("Image Upload failed");
    }
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { categoryid } = req.body;
    console.log(categoryid);
    const category = await Category.findById(categoryid);

    if (!category) {
      throw new Error("Category not found");
    }

    // Delete the initial photo if it exists
    if (category.cloudinary_id) {
      await cloudinary.uploader.destroy(category.cloudinary_id);
      console.log("Image deleted successfully");
    }

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Swad Menu/Categories",
        width: 1280,
        height: 720,
        crop: "fill",
        gravity: "auto",
        fetch_format: "auto",
        quality: "auto",
        responsive: true,
        object_fit: "cover",
      });

      // Update category properties
      category.name = req.body.name;
      category.imgUrl = result.secure_url;
      category.cloudinary_id = result.public_id;

      await category.save();
    } else {
      // Only update the category name if no new image is provided
      category.name = req.body.name;
      await category.save();
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { categoryid } = req.body;
    const category = await Category.findById(categoryid);

    if (!category) {
      throw new Error("Category not found");
    }

    // Delete the category's photo if it exists
    if (category.cloudinary_id) {
      await cloudinary.uploader.destroy(category.cloudinary_id);
      console.log("Image deleted successfully");
    }

    // Delete the category's menus and subcategories
    await Menu.deleteMany({ categoryId: categoryid });
    await Subcategory.deleteMany({ categoryId: categoryid });

    // Delete the category from the database
    await Category.deleteOne({ _id: categoryid });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { subCategoryId } = req.body;
    const subCategory = await Subcategory.findById(subCategoryId);

    if (!subCategory) {
      throw new Error("SubCategory not found");
    }

    // Delete the category's menus and subcategories
    await Menu.deleteMany({ subCategoryId: subCategoryId });

    // Delete the category from the database
    await Subcategory.deleteOne({ _id: subCategoryId });
    res.json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, subCategoryName } = req.body;

    // Create a new subcategory under the specified category in your model or data structure
    let subCategory = new Subcategory({
      subCategoryName: subCategoryName,
      categoryId: categoryId,
    });
    await subCategory.save();
    res.json(subCategory);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getSubCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Subcategory.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subCategoryId } = req.body;
    console.log(subCategoryId);
    const categoryData = await Subcategory.findOne({ _id: subCategoryId });
    res.json(categoryData);
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.params;
    const categoryData = await Category.findOne({ name: name });
    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
