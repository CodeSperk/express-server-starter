import app from './app';
import config from './app/config';
import { connectDB } from './app/config/connectDB';

const PORT = config.port || 3000;

(async function main() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.info(`Server running on port ${PORT}`);
      console.info(`Environment: ${config.node_env}`);
      console.info(`MongoDB: ${config.database_url ? 'Connected' : 'Not configured'}`);
    });
  } catch (err) {
    console.error('Server startup failed.', err);
    process.exit(1);
  }
})();

export default app;
