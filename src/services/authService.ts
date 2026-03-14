import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { SignupInput, LoginInput } from "../validators/authValidator";
import { logger } from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const signup = async (payload: SignupInput): Promise<IUser> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = new User({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  const saved = await user.save();
  logger.info("User signed up", { userId: saved.id, email: saved.email });
  return saved;
};

export const login = async (payload: LoginInput): Promise<{ token: string; user: IUser }> => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  logger.info("User logged in", { userId: user.id, email: user.email });

  return { token, user };
};

export const getProfile = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select("-password");
};

