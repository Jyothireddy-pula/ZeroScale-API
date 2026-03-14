import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: Record<string, unknown>,
): Response<ApiResponse<T>> =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
): Response<ApiResponse<unknown>> =>
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });

