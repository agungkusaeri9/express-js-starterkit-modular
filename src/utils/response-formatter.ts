import type { Response } from "express";
import type { ApiResponse } from "../types/api-response";

export const responseFormatter = {
  success: <T>(
    res: Response,
    message: string,
    data?: T,
    meta?: ApiResponse["meta"],
    httpCode: number = 200,
    paginate: boolean = false
  ) => {
    const body: ApiResponse<T> = {
      status: true,
      message,
    };

    if (data !== undefined) body.data = data;
    if (paginate && meta !== undefined) {
      body.meta = meta;
    }

    return res.status(httpCode).json(body);
  },

  error: (
    res: Response,
    message: string,
    errors?: Record<string, string[]>,
    httpCode: number = 400
  ) => {
    const body: ApiResponse = { status: false, message };
    if (errors) body.errors = errors;
    return res.status(httpCode).json(body);
  },

  unauthorized: (res: Response, message = "Unauthorized") =>
    res.status(401).json({ status: false, message } satisfies ApiResponse),

  forbidden: (res: Response, message = "Forbidden") =>
    res.status(403).json({ status: false, message } satisfies ApiResponse),

  notFound: (res: Response, message = "Resource not found") =>
    res.status(404).json({ status: false, message } satisfies ApiResponse),

  serverError: (res: Response, message = "Internal server error") =>
    res.status(500).json({ status: false, message } satisfies ApiResponse),
};
