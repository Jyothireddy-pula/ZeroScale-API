import { NextFunction, Request, Response } from "express";
import {
  createHost,
  deleteHost,
  getHostById,
  getHosts,
  updateHost,
} from "../services/hostService";
import {
  hostCreateSchema,
  hostQuerySchema,
  hostUpdateSchema,
} from "../validators/hostValidator";
import { sendError, sendSuccess } from "../utils/responseHandler";

export const createHostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = hostCreateSchema.parse(req.body);
    const host = await createHost(parsed);
    return sendSuccess(res, 201, "Host created successfully", host);
  } catch (error) {
    return next(error);
  }
};

export const getHostsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = hostQuerySchema.parse(req.query);
    const result = await getHosts(parsed);
    return sendSuccess(res, 200, "Hosts fetched successfully", result.data, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    return next(error);
  }
};

export const getHostByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const host = await getHostById(req.params.id);
    if (!host) {
      return sendError(res, 404, "Host not found");
    }
    return sendSuccess(res, 200, "Host fetched successfully", host);
  } catch (error) {
    return next(error);
  }
};

export const getHostsByStateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = hostQuerySchema.parse({ ...req.query, state: req.params.state });
    const result = await getHosts(parsed);
    return sendSuccess(res, 200, "Hosts fetched successfully", result.data, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateHostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = hostUpdateSchema.parse(req.body);
    const host = await updateHost(req.params.id, parsed);
    if (!host) {
      return sendError(res, 404, "Host not found");
    }
    return sendSuccess(res, 200, "Host updated successfully", host);
  } catch (error) {
    return next(error);
  }
};

export const deleteHostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const host = await deleteHost(req.params.id);
    if (!host) {
      return sendError(res, 404, "Host not found");
    }
    return sendSuccess(res, 200, "Host deleted successfully", host);
  } catch (error) {
    return next(error);
  }
};

