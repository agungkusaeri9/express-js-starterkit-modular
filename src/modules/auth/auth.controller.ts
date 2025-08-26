import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import { responseFormatter } from "../../utils/response-formatter";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    return responseFormatter.success(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const result = await authService.refreshAccessToken(req.body.refreshToken);
  return responseFormatter.success(res, "Token refreshed", result);
};

export const logout = async (req: Request, res: Response) => {
  const result = await authService.logout(req.body.refreshToken);
  return responseFormatter.success(res, "Logout successful", result);
};
