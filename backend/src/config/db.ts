import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}
