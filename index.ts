import mongoose, { Schema, Document } from "mongoose";

// TypeScript Interfaces for MongoDB Models
interface IHost extends Document {
  id: number;
  city: string;
  state: string;
  address: string;
  zip: string;
  lat: string;
  long: string;
  short_name: string;
  full_name: string;
  phone: string;
}

interface IReview extends Document {
  id: number;
  name: string;
  host: number;
  review: string;
  visit: boolean;
  visit_date: string;
  room: string;
  amenities: string;
}

// MongoDB URI from environment
const MONGO_URI: string = process.env.MONGO_URI || "";

// ✅ Define Schemas with TypeScript
const hostSchema: Schema = new Schema<IHost>({
  id: Number,
  city: String,
  state: String,
  address: String,
  zip: String,
  lat: String,
  long: String,
  short_name: String,
  full_name: String,
  phone: String,
});

const reviewSchema: Schema = new Schema<IReview>({
  id: Number,
  name: String,
  host: Number,
  review: String,
  visit: Boolean,
  visit_date: String,
  room: String,
  amenities: String,
});

// Create Models
const Hosts = mongoose.model<IHost>("Hosts", hostSchema);
const Reviews = mongoose.model<IReview>("Reviews", reviewSchema);

// Connect to MongoDB
async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("✅ MongoDB Connected Successfully");
  }
}

// Define Type for API Responses
interface APIGatewayEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

// Lambda Handler Function
export const handler = async (event: APIGatewayEvent) => {
  console.log("🚀 Lambda function triggered", event);

  await connectDB();

  try {
    if (event.path === "/") {
      return { statusCode: 200, body: JSON.stringify({ message: "Welcome to Mongoose API! 🔥" }) };
    }

    if (event.path === "/fetchHosts") {
      const hosts = await Hosts.find();
      return { statusCode: 200, body: JSON.stringify(hosts) };
    }

    if (event.path.startsWith("/fetchHosts/") && event.httpMethod === "GET") {
      const state = event.path.split("/").pop();
      const hosts = await Hosts.find({ state });
      return { statusCode: 200, body: JSON.stringify(hosts) };
    }

    if (event.path.startsWith("/fetchHost/") && event.httpMethod === "GET") {
      const id = parseInt(event.path.split("/").pop()!, 10);
      const host = await Hosts.findOne({ id });
      if (!host) {
        return { statusCode: 404, body: JSON.stringify({ error: "Host not found!" }) };
      }
      return { statusCode: 200, body: JSON.stringify(host) };
    }

    if (event.path === "/insert_review" && event.httpMethod === "POST") {
      const data = JSON.parse(event.body!);
      const lastReview = await Reviews.find().sort({ id: -1 }).limit(1);
      const new_id = lastReview.length ? lastReview[0].id + 1 : 1;

      const review = new Reviews({
        id: new_id,
        name: data.name,
        host: data.host,
        review: data.review,
        visit: true,
        visit_date: data.visit_date,
        room: data.room,
        amenities: data.amenities,
      });

      const savedReview = await review.save();
      return { statusCode: 201, body: JSON.stringify(savedReview) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: "Route not found" }) };
  } catch (error) {
    console.error("❌ Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};
