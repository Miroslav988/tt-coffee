import express from "express";
import fs from "fs/promises";
import path from "path";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/tableData", verifyToken, async (req, res) => {
  try {
    const productsPath = path.resolve("backend/data/products.json");
    const productsData = await fs.readFile(productsPath, "utf-8");
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    console.error("Ошибка при получении данных продуктов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
