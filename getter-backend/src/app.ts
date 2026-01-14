import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  morgan("dev", {
    stream: {
      write: (message: string) => logger.info(message.trim()), // Use logger.info for requests
    },
  })
);


app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Sking Cosmetics API is healthy 🚀",
  });
});



app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

export default app;
