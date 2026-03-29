import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/responseHandler";
import { logger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error("Unhandled error", { err });

  if (err instanceof Error) {
    return sendError(res, 500, err.message);
  }

  return sendError(res, 500, "Internal Server Error");
};

