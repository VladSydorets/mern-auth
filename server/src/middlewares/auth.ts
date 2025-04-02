import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User } from "../models/User";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: User) => {
    if (err) {
      return res.sendResponse(500, "ERror");
    } else if (!user) {
      return res.sendResponse(401, "Unauthorized");
    }

    req.user = user;
    next();
  })(req, res, next);
};
