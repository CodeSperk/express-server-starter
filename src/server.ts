import app from "./app";
import config from "./app/config";
import { connectDB } from "./app/config/connectDB";

const PORT = config.port || 3000;

(async function main() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.node_env}`);
      console.log(
        `MongoDB: ${config.database_url ? "Connected" : "Not configured"}`
      );
    });
  } catch (err) {
    console.log("Server startup failed.", err);
    process.exit(1);
  }
})();

export default app;
