import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error connecting to MongoDB: ${errMsg}`);
    process.exit(1);
  }
};

export default connectDB;
