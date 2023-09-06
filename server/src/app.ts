import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.routes";
import categoryRoute from "./routes/category.routes";
import menuRoute from "./routes/menu.routes";

const app: Express = express();

//MONGODB CONNECTION
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Connected to MongoDB");
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

//MIDDLEWARES
app.use(express.json());
app.use(cors({ origin: "https://swadmenu.vercel.app" }));
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

//ROUTES
app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoute);
app.use("/api/menu", menuRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(`${process.env.PORT}`, () => {
  connect();
  console.log(`Server is running on ${process.env.PORT}`);
});
