import { Request, Response, NextFunction, RequestHandler } from 'express';
import status from 'http-status';
import AppError from './appError';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(
    status.NOT_FOUND,
    `Route not found - ${req.method} ${req.originalUrl}`,
  );
  next(error);
};

const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
  };
};

export { AppError, notFound, asyncHandler };
