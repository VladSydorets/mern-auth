import validator from "validator";
import { Response } from "express";
import { UserFields } from "../models/User";

export const validateUser = (
  res: Response,
  data: UserFields,
  requiredFields?: Array<keyof UserFields>
) => {
  const fieldsToCheck = requiredFields || Object.keys(data);
  const { name, password, email } = data;

  for (const field of fieldsToCheck) {
    if (!data[field]) {
      res.sendResponse(400, "All fields are required!");
      return;
    }
  }

  if (name && !validator.isAlpha(name)) {
    res.sendResponse(400, "Invalid name");
    return false;
  }

  if (email && !validator.isEmail(email)) {
    res.sendResponse(400, "Invalid email");
    return false;
  }

  if (password && !validator.isStrongPassword(password)) {
    res.sendResponse(400, "Password is not strong enough");
    return false;
  }

  return true;
};
