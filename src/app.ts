import 'reflect-metadata';
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { createConnection } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import { HttpErrorHandler } from './middlewares/error-handler.middleware';
import { createClient } from 'redis';

export const app = express();
const port = process.env.PORT || 4500;

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis connected');
  }
};

app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

useExpressServer(app, {
  controllers: [path.join(__dirname + '/controllers/*.controller.js')],
  defaultErrorHandler: false,
  routePrefix: '/api',
  middlewares: [HttpErrorHandler]
});

const createConnectionCall = process.env.NODE_ENV === 'test' ? null : createConnection();

const bootstrap = async () => {
  try {
    await Promise.all([connectRedis(), createConnectionCall]);
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Error during setup:', error);
  }
};

bootstrap();
