import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecret";

export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};
