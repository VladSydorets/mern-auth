import { Request, Response } from "express";
import { User, UserModel } from "../models/User";
import { validateUser } from "../utils/validate-user";
import { hashPassword } from "../utils/hash-password";
import { sendTokenResponse } from "../utils/send-token-response";

export const getUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (user) {
    return res.sendResponse(200, { user });
  } else {
    return res.sendResponse(400, "Invalid token");
  }
  // try {
  //   const user = await UserModel.findById(req.user.id);

  //   if (user) {
  //     return res.sendResponse(200, { user });
  //   } else {
  //     return res.sendResponse(400, "Invalid token");
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.sendResponse(500, "Error");
  // }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const tokenUser = req.user as User;
  const tokenUserId = tokenUser._id.toString();

  if (userId !== tokenUserId) {
    res.sendResponse(403, "Access denied");
  } else {
    await UserModel.findByIdAndDelete(userId);
    res.sendResponse(200, "User deleted");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const tokenUser = req.user as User;
  const tokenUserId = tokenUser._id.toString();

  const isValid = validateUser(res, req.body, ["name", "email"]);
  if (!isValid) return;

  if (userId !== tokenUserId) {
    res.sendResponse(403, "Access denied");
  } else {
    const hashedPassword = req.body.password
      ? await hashPassword(req.body.password)
      : tokenUser.password;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { ...req.body, password: hashedPassword },
      { new: true }
    );

    sendTokenResponse(res, updatedUser as User, 200);
  }
};
