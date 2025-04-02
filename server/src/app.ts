import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import { configurePassport } from "./config/passport";
import { responseMiddleware } from "./middlewares/response-middleware";
import { authenticateJwt } from "./middlewares/auth";

import { router as authRoutes } from "./routes/auth";
import { router as userRoutes } from "./routes/user";
import { connectDB } from "./config/db";

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use((req: Request, res: Response, next: NextFunction) => {
  configurePassport(passport, res);
  next();
});
app.use(passport.initialize());

app.use(responseMiddleware);

// Health check route
app.get("/test", (req: Request, res: Response) => {
  res.send("Welcome to the auth test page");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateJwt, userRoutes);

export default app;
