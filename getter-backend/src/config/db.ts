import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      logger.error("MongoDB URI is not defined in environment variables");
      throw new Error("Missing MongoDB URI");
    }

    await mongoose.connect(mongoUri);
    logger.info("✅ MongoDB connected Successfully");
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
