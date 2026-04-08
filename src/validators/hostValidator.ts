import { z } from "zod";

export const hostCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  state: z.string().min(1, "State is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(1).max(5),
});

export const hostUpdateSchema = hostCreateSchema.partial();

export const hostQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((v) => Number.isFinite(v) && v > 0, "page must be a positive number"),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .refine((v) => Number.isFinite(v) && v > 0 && v <= 100, "limit must be between 1 and 100"),
  sortByRating: z.enum(["asc", "desc"]).optional(),
  sortBy: z.enum(["name", "state", "rating", "createdAt"]).optional(),
  state: z.string().optional(),
  rating: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (v >= 1 && v <= 5), "rating must be between 1 and 5"),
  search: z.string().optional(),
  minRating: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (v >= 1 && v <= 5), "minRating must be between 1 and 5"),
  maxRating: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (v >= 1 && v <= 5), "maxRating must be between 1 and 5"),
});

export type HostCreateInput = z.infer<typeof hostCreateSchema>;
export type HostUpdateInput = z.infer<typeof hostUpdateSchema>;
export type HostQueryInput = z.infer<typeof hostQuerySchema>;

