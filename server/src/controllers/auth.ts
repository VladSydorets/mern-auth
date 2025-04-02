import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { sendTokenResponse } from "../utils/send-token-response";
import { hashPassword } from "../utils/hash-password";
import { validateUser } from "../utils/validate-user";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (user) return res.sendResponse(400, "User already exists");

    const isValid = validateUser(res, req.body);
    if (!isValid) return;

    user = new UserModel({ name, email, password });

    user.password = await hashPassword(password);
    await user.save();

    return sendTokenResponse(res, user, 201);
  } catch (err) {
    console.error(err);
    return res.sendResponse(500, "error");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const isValid = validateUser(res, req.body, ["email", "password"]);
    if (!isValid) return;

    let user = await UserModel.findOne({ email });
    if (!user) return res.sendResponse(400, "Such user does not exist");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.sendResponse(400, "Invalid password");

    return sendTokenResponse(res, user, 200);
  } catch (err) {
    console.error(err);
    return res.sendResponse(500, "Error");
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    succes: true,
    data: {},
  });
};
