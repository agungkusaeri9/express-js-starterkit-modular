import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { responseFormatter } from "../utils/response-formatter";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    `[${req.method}] ${req.url} - ${err.message || "Unknown error"}`
  );
  if (err instanceof AppError) {
    return responseFormatter.error(
      res,
      err.message,
      err.errors,
      err.statusCode
    );
  }

  console.error("Unexpected Error:", err);
  return responseFormatter.serverError(res, "Internal server error");
};
