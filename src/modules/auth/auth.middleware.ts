import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { responseFormatter } from "../../utils/response-formatter";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return responseFormatter.error(
      res,
      "Access denied, invalid token",
      null,
      401
    );
  }
};
