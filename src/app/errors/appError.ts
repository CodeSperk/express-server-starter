import { TErrorSources } from "../types/error.type";

class AppError extends Error {
  public statusCode: number;
  public errors: TErrorSources | null;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: TErrorSources | null = null,
    isOperational: boolean = true,
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
