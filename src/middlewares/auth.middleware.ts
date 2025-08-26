import { Request, Response, NextFunction } from "express";
import { responseFormatter } from "../utils/response-formatter";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  userId: number;
  username: string;
  //   role?: string;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return responseFormatter.error(
        res,
        "Unauthorized: No token provided",
        null,
        401
      );
    }

    const decoded = verifyToken(token) as DecodedToken;
    req.user = decoded;

    next();
  } catch (error: any) {
    return responseFormatter.error(
      res,
      error.message || "Unauthorized: Invalid token",
      null,
      401
    );
  }
};
