import app from "./app";
import dotenv from "dotenv";
import { config } from "./config";

dotenv.config({ debug: false });

app.listen(config.app.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.app.port}`);
});
