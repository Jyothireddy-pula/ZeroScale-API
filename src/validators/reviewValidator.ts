import { z } from "zod";

export const reviewCreateSchema = z.object({
  hostId: z.string().min(1, "hostId is required"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(1).max(5),
});

export const reviewUpdateSchema = z.object({
  comment: z.string().min(1, "Comment is required").optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;

