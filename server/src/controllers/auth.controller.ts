import { NextFunction, Request, Response } from "express";
import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error";

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if email is unique
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin)
      return next(createError(404, "A admin is already using this email"));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let admin = new Admin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });
    await admin.save();
    res.json(admin);
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return next(createError(404, "Admin not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!isPasswordCorrect)
      return next(createError(404, "Wrong adminName or password"));

    const token = jwt.sign({ id: admin._id }, `${process.env.JWT_KEY}`, {
      expiresIn: "1d",
    });

    const { password, ...otherDetails } = admin?._doc;
    console.log;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        // sameSite: "none",
        // secure: true,
      })
      .status(200)
      .json({ ...otherDetails, token });
  } catch (err) {
    next(err);
  }
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //On client, also delete the Access Token
  try {
    const cookies = req.cookies;
    if (!cookies?.accessToken) return res.sendStatus(204);

    res.clearCookie("accessToken", {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
