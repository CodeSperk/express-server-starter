import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import status from 'http-status';

const app: Application = express();

//parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: 'Server is running',
  });
});

export default app;
