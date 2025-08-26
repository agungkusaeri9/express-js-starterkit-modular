import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import prisma from "../utils/prisma";
import { userService } from "../modules/user/user.service";

jest.mock("../../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  refreshToken: {
    deleteMany: jest.fn(),
  },
}));
jest.mock("bcryptjs");

describe("userService", () => {
  const mockUser = {
    id: 1,
    username: "agung",
    password: "hashedPassword",
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        username: "agung",
        createdAt: new Date(),
      });

      const result = await userService.createUser("agung", "123456");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "agung" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("username", "agung");
    });

    it("should throw error if username already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(userService.createUser("agung", "123456")).rejects.toThrow(
        new AppError("Username already exists", 400)
      );
    });
  });

  describe("getAllUsers", () => {
    it("should return users without pagination", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userService.getAllUsers(1, 10, false);

      expect(result.paginate).toBe(false);
      expect(result.data).toHaveLength(1);
    });

    it("should return paginated users", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const result = await userService.getAllUsers(1, 10, true);

      expect(result.paginate).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.meta).toMatchObject({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe("getUserById", () => {
    it("should return user if found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
    });

    it("should return null if not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserById(99);

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update username", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
        username: "updated",
        createdAt: new Date(),
      });

      const result = await userService.updateUser(1, { username: "updated" });

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result?.username).toBe("updated");
    });

    it("should update password", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
        username: "agung",
        createdAt: new Date(),
      });

      const result = await userService.updateUser(1, { password: "newpass" });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result?.username).toBe("agung");
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateUser(99, { username: "test" })
      ).rejects.toThrow(new AppError("User not found", 404));
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue({
        id: 1,
        username: "agung",
      });

      const result = await userService.deleteUser(1);

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result).toEqual({ id: 1, username: "agung" });
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUser(99)).rejects.toThrow(
        new AppError("User not found", 404)
      );
    });
  });
});
