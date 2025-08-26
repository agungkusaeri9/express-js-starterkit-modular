import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";

export const createUser = async (username: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new AppError("Username already exists", 400);

  return prisma.user.create({
    data: { username, password: hashed },
    select: { id: true, username: true, createdAt: true },
  });
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  paginate: boolean = true
) => {
  if (!paginate) {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, createdAt: true },
    });

    return {
      data: users,
      meta: undefined,
      paginate: false,
    };
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    paginate: true,
  };
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, createdAt: true },
  });
};

export const updateUser = async (
  id: number,
  data: { username?: string; password?: string }
) => {
  const { username, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError("User not found", 404);

  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(username && { username }),
      ...(hashedPassword && { password: hashedPassword }),
    },
    select: { id: true, username: true, createdAt: true },
  });
};

export const deleteUser = async (id: number) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError("User not found", 404);

  await prisma.refreshToken.deleteMany({ where: { userId: id } });
  return prisma.user.delete({
    where: { id },
    select: { id: true, username: true },
  });
};
