import app from "./app";
import config from "./app/config";
import { connectDB } from "./app/config/connectDB";

(async function main() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Example app listening on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.log("Server startup failed.", err);
  }
})();
