import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    reqired: true,
    unique: true,
  },
  imgUrl: String,
  cloudinary_id: String,
});

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

// Define the schema for the menu item
const menuSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
});

const Category = mongoose.model("Category", categorySchema);
const Subcategory = mongoose.model("Subcategory", subCategorySchema);
const Menu = mongoose.model("Menu", menuSchema);

export { Category, Subcategory, Menu };
