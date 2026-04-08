import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>("User", userSchema);

