import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { responseFormatter } from "../utils/response-formatter";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        err.issues.forEach((issue) => {
          const field =
            issue.path[issue.path.length - 1]?.toString() || "unknown";
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        });

        return responseFormatter.error(
          res,
          "Validation failed",
          fieldErrors,
          422
        );
      }

      return responseFormatter.error(
        res,
        "Unexpected validation error",
        undefined,
        500
      );
    }
  };
