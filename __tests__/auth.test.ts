import request from "supertest";
import mongoose from "mongoose";
import { handler } from "../index";
import { connectDB } from "../src/index";

const invoke = (event: Record<string, unknown>) =>
  handler(
    {
      httpMethod: event.httpMethod || "GET",
      path: event.path || "/",
      body: event.body ? JSON.stringify(event.body) : null,
      headers: event.headers || {},
    } as any,
    {} as any,
  );

describe("Auth API", () => {
  beforeAll(async () => {
    process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zeroscale-test";
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("health check should work", async () => {
    const res = await invoke({ httpMethod: "GET", path: "/" });
    const body = JSON.parse((res as any).body as string);
    expect((res as any).statusCode).toBe(200);
    expect(body.success).toBe(true);
  });
});

