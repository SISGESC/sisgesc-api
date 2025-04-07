import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import 'reflect-metadata';
import { AppDataSource } from './database/app-data-source';
import enrollmentRouter from './routers/enrollment';
import classGroupRouter from './routers/class-group';
import shiftRouter from './routers/shift';
import tuitionRouter from './routers/tuition';
import { swaggerSpec } from './swagger';

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

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "SISGESC API Documentation"
  }));

  app.use('/', enrollmentRouter);
  app.use('/', classGroupRouter);
  app.use('/', shiftRouter);
  app.use('/', tuitionRouter);

  return app;
};
