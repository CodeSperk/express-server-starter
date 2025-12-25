import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import status from 'http-status';
import { notFound } from './app/errors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { testRoutes } from './app/routes/test.routes';

const app: Application = express();

//parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/test', testRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
