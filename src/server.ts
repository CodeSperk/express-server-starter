import 'dotenv/config';

import app from './app';
import config from './app/config';
import { connectDB } from './app/config/connectDB';

async function main() {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.info(`Server running on port ${config.port}`);
      console.info(`Environment: ${config.node_env}`);
    });

    const shutdown = (signal: string) => {
      console.warn(`Received ${signal}. Shutting down server...`);
      server.close(() => {
        console.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Server startup failed.', err);
    process.exit(1);
  }
}

process.on('unhandledRejection', err => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

main();
