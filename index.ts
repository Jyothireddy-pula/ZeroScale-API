// index.ts - Your ZeroScale API handler (renamed from handler.ts)
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./src/routes/authRoutes";
import hostRoutes from "./src/routes/hostRoutes";
import reviewRoutes from "./src/routes/reviewRoutes";
import { rateLimiter } from "./src/middleware/rateLimiter";
import { errorMiddleware } from "./src/middleware/errorMiddleware";
import { requestLogger } from "./src/utils/logger";
import { performanceMonitor, healthCheck, requestCounter, MetricsCollector } from "./src/utils/monitoring";

const app = express();

// Core middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Monitoring middleware
app.use(performanceMonitor);
app.use(requestCounter);

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
    servers: [{ url: "/api/v1" }, { url: "/dev/api/v1" }],
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", healthCheck);
app.get("/health", healthCheck);

// Routes with API versioning
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hosts", hostRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Error handling
app.use(errorMiddleware);

const expressHandler = serverless(app, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: async (_request: any, _event: any, _context: any) => {
    await connectDB();
  },
});

export const handler = expressHandler;
