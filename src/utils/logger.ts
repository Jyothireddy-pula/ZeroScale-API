import winston from "winston";

const { combine, timestamp, printf, json, colorize } = winston.format;

const isProduction = process.env.NODE_ENV === "production";

const logFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const base = `${ts} [${level}]: ${message}`;
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return base + metaString;
});

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],
});

export const requestLogger = (info: {
  method: string;
  path: string;
  statusCode?: number;
  ip?: string;
  userId?: string;
}) => {
  logger.info("HTTP Request", info);
};

