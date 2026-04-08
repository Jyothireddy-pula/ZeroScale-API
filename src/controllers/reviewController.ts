import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  createReview,
  deleteReview,
  getReviewsForHost,
  updateReview,
} from "../services/reviewService";
import { reviewCreateSchema, reviewUpdateSchema } from "../validators/reviewValidator";
import { sendError, sendSuccess } from "../utils/responseHandler";

export const createReviewController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }
    const parsed = reviewCreateSchema.parse(req.body);
    const review = await createReview(req.user.userId, parsed);
    return sendSuccess(res, 201, "Review created successfully", review);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("duplicate key") || error.message.includes("E11000"))
    ) {
      return sendError(res, 400, "You have already reviewed this host");
    }
    return next(error);
  }
};

export const getReviewsForHostController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await getReviewsForHost(req.params.hostId);
    return sendSuccess(res, 200, "Reviews fetched successfully", reviews);
  } catch (error) {
    return next(error);
  }
};

export const updateReviewController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }
    const parsed = reviewUpdateSchema.parse(req.body);
    const review = await updateReview(req.params.id, req.user.userId, parsed);
    if (!review) {
      return sendError(res, 404, "Review not found or not owned by user");
    }
    return sendSuccess(res, 200, "Review updated successfully", review);
  } catch (error) {
    return next(error);
  }
};

export const deleteReviewController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }
    const review = await deleteReview(req.params.id, req.user.userId);
    if (!review) {
      return sendError(res, 404, "Review not found or not owned by user");
    }
    return sendSuccess(res, 200, "Review deleted successfully", review);
  } catch (error) {
    return next(error);
  }
};

