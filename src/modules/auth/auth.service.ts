import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import prisma from "../../utils/prisma";

export const authService = {
  login: async (username: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) throw new AppError("Invalid username or password", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid username or password", 401);

    const accessToken = generateToken(
      { userId: user.id, username: user.username },
      "15m"
    );

    const refreshToken = generateToken({ userId: user.id }, "7d");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info(`User ${username} logged in successfully`);

    return {
      user: { id: user.id, username: user.username },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: "24h",
      },
    };
  },

  logout: async (refreshToken: string) => {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: "Logout successful" };
  },

  refreshAccessToken: async (refreshToken: string) => {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) throw new AppError("Invalid refresh token", 401);

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError("Refresh token expired", 401);
    }
    const decoded = verifyToken(refreshToken) as { userId: number };
    const accessToken = generateToken(
      { userId: decoded.userId, username: storedToken.user.username },
      "15m"
    );
    return { accessToken, expiresIn: "15m" };
  },

  me: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    return user;
  },
};
