import cors from 'cors';
import express from 'express';

import { artistsRouter } from './routes/artists.js';
import { healthRouter } from './routes/health.js';
import { songsRouter } from './routes/songs.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? true,
    }),
  );
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/artists', artistsRouter);
  app.use('/songs', songsRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Route not found' },
    });
  });

  return app;
}
