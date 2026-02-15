import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import status from 'http-status';
import { notFound } from './app/errors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { testRoutes } from './app/routes/test.routes';
import { authRoutes } from './app/modules/auth/auth.route';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { rbacAdminRoutes } from './app/modules/rbac/rbac.admin.route';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);


// CORS & Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (_req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/auth', authRoutes);
app.use('/rbac', rbacAdminRoutes);
app.use('/test', testRoutes);

//Error Handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
