import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import prisma from "../utils/prisma";
import { generateToken, verifyToken } from "../utils/jwt";
import { authService } from "../modules/auth/auth.service";
jest.mock("bcryptjs");
jest.mock("../../src/utils/jwt");
jest.mock("../../src/utils/logger");
jest.mock("../../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe("authService", () => {
  const mockUser = {
    id: 1,
    username: "agung",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("fakeToken");

      const result = await authService.login("agung", "password123");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "agung" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(result).toEqual({
        user: { id: 1, username: "agung" },
        tokens: {
          accessToken: "fakeToken",
          refreshToken: "fakeToken",
          expiresIn: "24h",
        },
      });
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login("wrong", "password")).rejects.toThrow(
        new AppError("Invalid username or password", 401)
      );
    });

    it("should throw error if password does not match", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login("agung", "wrong")).rejects.toThrow(
        new AppError("Invalid username or password", 401)
      );
    });
  });

  describe("logout", () => {
    it("should delete refresh token", async () => {
      (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 1,
      });

      const result = await authService.logout("fakeToken");

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: "fakeToken" },
      });
      expect(result).toEqual({ message: "Logout successful" });
    });
  });

  describe("refreshAccessToken", () => {
    const mockRefreshToken = {
      id: 1,
      token: "refreshToken",
      expiresAt: new Date(Date.now() + 10000),
      userId: 1,
      user: mockUser,
    };

    it("should generate new access token if refresh token valid", async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );
      (verifyToken as jest.Mock).mockReturnValue({ userId: 1 });
      (generateToken as jest.Mock).mockReturnValue("newAccessToken");

      const result = await authService.refreshAccessToken("refreshToken");

      expect(result).toEqual({
        accessToken: "newAccessToken",
        expiresIn: "15m",
      });
    });

    it("should throw error if refresh token not found", async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.refreshAccessToken("wrongToken")
      ).rejects.toThrow(new AppError("Invalid refresh token", 401));
    });

    it("should throw error if refresh token expired", async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        authService.refreshAccessToken("expiredToken")
      ).rejects.toThrow(new AppError("Refresh token expired", 401));
    });
  });

  describe("me", () => {
    it("should return user if found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.me(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.me(99)).rejects.toThrow(
        new AppError("User not found", 404)
      );
    });
  });
});
