import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { AppError, asyncHandler } from '../errors';

const router = Router();

const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

router.get('/operational-error', (_req: Request, _res: Response) => {
  throw new AppError(400, 'This is an operational error', [
    { path: 'email', message: 'Email is invalid' },
    { path: 'password', message: 'Password must be at least 6 characters' },
  ]);
});

router.get('/non-operational-error', (_req: Request, _res: Response) => {
  throw new AppError(500, 'This is a non-operational error', null, false);
});

router.get('/programming-error', (_req: Request, _res: Response) => {
  throw new Error('This is a programming error');
});

router.post('/zod-validation', (req: Request, res: Response) => {
  const result = testSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }
  res.json({ success: true, data: result.data });
});

router.get('/multi-field-error', (_req: Request, _res: Response) => {
  throw new AppError(422, 'Multiple validation errors', [
    { path: 'email', message: 'Email is required' },
    { path: 'password', message: 'Password must be at least 6 characters' },
    { path: 'username', message: 'Username must be unique' },
  ]);
});

router.get(
  '/async-error',
  asyncHandler(async (_req: Request, _res: Response) => {
    throw new AppError(400, 'Async operation failed');
  }),
);

router.get('/simple-error', (_req: Request, _res: Response) => {
  throw new AppError(401, 'You are not authorized');
});

router.get('/generic-error', (_req: Request, _res: Response) => {
  throw new Error('This is a generic error ');
});

router.get('/success', (_req: Request, res) => {
  res.json({
    success: true,
    message: 'Test route is working perfectly!',
    timestamp: new Date().toISOString(),
  });
});

export const testRoutes = router;
