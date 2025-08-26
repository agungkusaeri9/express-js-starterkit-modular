import { Request, Response } from "express";
import * as userService from "./user.service";
import { responseFormatter } from "../../utils/response-formatter";
import { ApiResponse } from "../../types/api-response";
import prisma from "../../utils/prisma";

// Create
export const create = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await userService.createUser(username, password);
  return responseFormatter.success(res, "User created", user, undefined, 201);
};

export const getAll = async (req: Request, res: Response<ApiResponse>) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const paginate = req.query.paginate !== "false";

  const result = await userService.getAllUsers(page, limit, paginate);

  return responseFormatter.success(
    res,
    "Users fetched successfully",
    result.data,
    result.meta,
    200,
    result.paginate
  );
};

// Read by ID
export const getById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  return responseFormatter.success(res, "User fetched", user);
};

// Update
export const update = async (req: Request, res: Response) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  return responseFormatter.success(res, "User updated", user);
};

// Delete
export const remove = async (req: Request, res: Response) => {
  const user = await userService.deleteUser(Number(req.params.id));
  return responseFormatter.success(res, "User deleted", user);
};
