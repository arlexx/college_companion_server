import { NextFunction, Request, Response } from "express";
import { Category, Menu } from "../models/menu.model";

export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { menuId, categoryId, subCategoryId, name, price } = req.body;
    console.log(menuId);
    if (subCategoryId) {
      let menu = new Menu({
        menuId: menuId,
        name: name,
        price: price,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
      });
      await menu.save();
      res.status(201).json(menu);
    } else {
      let menu = new Menu({
        menuId: menuId,
        name: name,
        price: price,
        categoryId: categoryId,
      });
      await menu.save();
      res.status(201).json(menu);
    }
  } catch (error) {
    next(error);
  }
};

export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

export const updateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, menuId, name, price } = req.body;
    const menu = await Menu.findById(_id);

    if (!menu) {
      throw new Error("Menu not found");
    }

    // Update category properties
    if (name) menu.name = name;
    if (price) menu.price = price;
    if (menuId) menu.menuId = menuId;

    await menu.save();
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

export const deleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { menuId } = req.body;
    const menu = await Menu.findById(menuId);

    if (!menu) {
      throw new Error("Menu not found");
    }

    // Delete the category from the database
    await Menu.deleteOne({ _id: menuId });

    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    next(err);
  }
};
