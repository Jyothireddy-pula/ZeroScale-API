import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview extends Document {
  hostId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "Host", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Enhanced indexes for performance
reviewSchema.index({ hostId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ hostId: 1, rating: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1, createdAt: -1 });
reviewSchema.index({ hostId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);

