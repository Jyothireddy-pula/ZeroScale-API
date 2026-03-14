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

export const Host = mongoose.model<IHost>("Host", hostSchema);

