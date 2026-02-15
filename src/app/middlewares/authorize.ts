import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../errors/appError';
import { hasPermission } from '../modules/rbac/rbac.guard';

export const authorize =
  (resource: string, action: string) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try{
      const user = req.user;

    if (!user?.roleId) {
      throw new AppError(status.FORBIDDEN, 'Access denied');
    }

    const allowed = await hasPermission(
      user.roleId,
      resource.toLowerCase(),
      action.toLowerCase(),
    );

    if (!allowed) {
      throw new AppError(
        status.FORBIDDEN,
        `You do not have permission to ${action} ${resource}`,
      );
    }
    
      next();
    } catch(err){
      next(err);
    }
  };
