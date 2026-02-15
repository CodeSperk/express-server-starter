import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        sub: string;
        roleId: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
