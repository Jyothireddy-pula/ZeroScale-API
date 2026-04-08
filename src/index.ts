import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/authRoutes";
import hostRoutes from "./routes/hostRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { requestLogger } from "./utils/logger";

const app = express();

// Core middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Simple request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    requestLogger({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ip: req.ip,
    });
  });
  next();
});

// MongoDB connection (re-used across invocations)
const MONGO_URI = process.env.MONGO_URI || "";

let mongoConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
  }
  await mongoConnectionPromise;
};

// Swagger setup
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZeroScale-API",
      version: "1.0.0",
      description: "Serverless backend API for hosts and reviews",
    },
    servers: [{ url: "/dev" }, { url: "/" }],
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "ZeroScale-API is running", data: null });
});

// Routes
app.use("/auth", authRoutes);
app.use("/hosts", hostRoutes);
app.use("/reviews", reviewRoutes);

// Error handling
app.use(errorMiddleware);

const expressHandler = serverless(app, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: async (_request: any, _event: any, _context: any) => {
    await connectDB();
  },
});

export const handler = expressHandler;

