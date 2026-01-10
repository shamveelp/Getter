import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
