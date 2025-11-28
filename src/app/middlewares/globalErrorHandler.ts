import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import status from "http-status";
import config from "../config";
import handleZodError from "../errors/zodError";
import AppError from "../errors/appError";
import {
  handleMongooseValidationError,
  handleMongooseCastError,
  handleMongooseDuplicateKeyError,
} from "../errors/mongooseError";
import { handleJWTError, handleJWTExpiredError } from "../errors/jwtError";
import { TErrorSource } from "../types/error.type";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errors: TErrorSource[] = [];

  const isOperational = err instanceof AppError ? err.isOperational : false;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.code === 11000) {
    const simplifiedError = handleMongooseDuplicateKeyError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "CastError") {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "JsonWebTokenError") {
    const simplifiedError = handleJWTError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "TokenExpiredError") {
    const simplifiedError = handleJWTExpiredError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [{ path: "", message: err.message }];
  } else if (err instanceof MulterError) {
    statusCode = status.BAD_REQUEST;

    const multerErrorMessages: Record<string, string> = {
      LIMIT_FILE_SIZE: "File size exceeds the allowed limit",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_UNEXPECTED_FILE: "Unexpected field name",
      LIMIT_PART_COUNT: "Too many form parts",
      LIMIT_FIELD_KEY: "Field name too long",
      LIMIT_FIELD_VALUE: "Field value too long",
      LIMIT_FIELD_COUNT: "Too many fields",
    };

    message = multerErrorMessages[err.code] || "File upload error";
    errors = [
      {
        path: err.field || "file",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    errors = [{ path: "", message: err.message }];
  } else {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
    errors = [{ path: "unknown", message: "An unexpected error occurred" }];
  }

  if (config.node_env === "production") {
    const noisyPaths = [
      "/.well-known/appspecific/com.chrome.devtools.json",
      "/favicon.ico",
      "/robots.txt",
    ];

    if (!noisyPaths.includes(req.path)) {
      if (isOperational) {
        console.log("Operational Error:", {
          statusCode,
          path: req.path,
          message: err.message,
        });
      } else {
        console.error("Program Error:", {
          statusCode,
          path: req.path,
          message: err.message,
          stack: err.stack,
        });
      }
    }
  }

  const response: any = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  if (config.node_env === "development") {
    response.stack = err?.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
