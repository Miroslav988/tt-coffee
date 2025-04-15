import express from "express";
import dotenv from "dotenv";
import { configureExpress } from "./config/express.js";
import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/data.routes.js";

dotenv.config();

const app = express();
const port = 8080;

if (!process.env.JWT_SECRET_KEY) {
  console.warn(
    "Warning: JWT_SECRET_KEY is not set in environment variables. Using default secret key for development."
  );
  process.env.JWT_SECRET_KEY = "default_dev_secret_key";
}

configureExpress(app);

app.use("/api", authRoutes);
app.use("/api/data", dataRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API сервер работает",
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
