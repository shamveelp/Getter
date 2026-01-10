import winston from "winston";

const { combine, timestamp, errors, json, colorize, printf } =
  winston.format;

const isProduction = process.env.NODE_ENV === "production";

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    isProduction ? json() : devFormat
  ),
  transports: [
    new winston.transports.Console({
      format: isProduction ? json() : combine(colorize(), devFormat),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
  exitOnError: false,
});

export default logger;
