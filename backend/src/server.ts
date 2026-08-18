import 'dotenv/config';

import app from './app';
import redisClient from './config/redis';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start(): Promise<void> {
  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(`ConnectU backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
