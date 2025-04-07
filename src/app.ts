import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import 'reflect-metadata';
import { AppDataSource } from './database/app-data-source';

export const createExpressApp = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }

  const app = express();
  app.use(bodyParser.json());

  app.use(cors({
    origin: ['https://quoti.cloud']
  }));

  // app.use('/api/enrollments', enrollmentRouter);

  return app;
};
