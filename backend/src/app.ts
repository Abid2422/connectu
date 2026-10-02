import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import discoveryRoutes from './routes/discovery.routes';
import swipesRoutes from './routes/swipes.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/discover', discoveryRoutes);
app.use('/api/swipes', swipesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
