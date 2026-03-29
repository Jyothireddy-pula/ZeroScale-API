import { Types } from "mongoose";
import { Review, IReview } from "../models/Review";
import { ReviewCreateInput, ReviewUpdateInput } from "../validators/reviewValidator";

export const createReview = async (
  userId: string,
  payload: ReviewCreateInput,
): Promise<IReview> => {
  const review = new Review({
    hostId: new Types.ObjectId(payload.hostId),
    userId: new Types.ObjectId(userId),
    comment: payload.comment,
    rating: payload.rating,
  });

  return review.save();
};

export const getReviewsForHost = async (hostId: string): Promise<IReview[]> => {
  return Review.find({ hostId: new Types.ObjectId(hostId) }).populate("userId", "name email");
};

export const updateReview = async (
  id: string,
  userId: string,
  payload: ReviewUpdateInput,
): Promise<IReview | null> => {
  return Review.findOneAndUpdate(
    { _id: id, userId: new Types.ObjectId(userId) },
    payload,
    { new: true },
  );
};

export const deleteReview = async (id: string, userId: string): Promise<IReview | null> => {
  return Review.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
};

