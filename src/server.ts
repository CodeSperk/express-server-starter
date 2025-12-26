import app from './app';
import config from './app/config';
import { connectDB } from './app/config/connectDB';

let isInitialized = false;

async function init() {
  if (!isInitialized) {
    await connectDB();
    isInitialized = true;
  }
}

/**
 * Vercel / Serverless handler
 */
export default async function handler(req: any, res: any) {
  await init();
  return app(req, res);
}

/**
 * Local / Docker execution
 */
if (config.node_env !== 'production') {
  init()
    .then(() => {
      app.listen(config.port, () => {
        console.info(`Server running on port ${config.port}`);
        console.info(`Environment: ${config.node_env}`);
      });
    })
    .catch(err => {
      console.error('Server startup failed', err);
      process.exit(1);
    });
}