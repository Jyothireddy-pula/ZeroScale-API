import mongoose, { Document, Schema } from "mongoose";

export interface IHost extends Document {
  name: string;
  state: string;
  description: string;
  rating: number;
  createdAt: Date;
}

const hostSchema = new Schema<IHost>(
  {
    name: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Enhanced indexes for performance
hostSchema.index({ state: 1 });
hostSchema.index({ rating: -1 });
hostSchema.index({ createdAt: -1 });
hostSchema.index({ name: 'text', description: 'text', state: 'text' });
hostSchema.index({ state: 1, rating: -1 });
hostSchema.index({ rating: -1, createdAt: -1 });

export const Host = mongoose.model<IHost>("Host", hostSchema);

