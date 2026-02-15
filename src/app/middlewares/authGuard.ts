import status from 'http-status';
import AppError from '../errors/appError';
import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError(status.UNAUTHORIZED, 'Unauthorized');

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; 
    next();
  } catch {
    throw new AppError(status.UNAUTHORIZED, 'Invalid token');
  }
};
