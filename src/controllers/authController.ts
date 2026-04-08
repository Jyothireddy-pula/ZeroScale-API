import { NextFunction, Request, Response } from "express";
import { login, signup, getProfile } from "../services/authService";
import { loginSchema, signupSchema } from "../validators/authValidator";
import { sendError, sendSuccess } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = signupSchema.parse(req.body);
    const user = await signup(parsed);
    return sendSuccess(res, 201, "User signed up successfully", {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already in use") {
      return sendError(res, 400, error.message);
    }
    return next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { token, user } = await login(parsed);

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return sendError(res, 401, error.message);
    }
    return next(error);
  }
};

export const profileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    const user = await getProfile(req.user.userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "Profile fetched successfully", user);
  } catch (error) {
    return next(error);
  }
};

