import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Токен отсутствует",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const usersPath = path.resolve("backend/data/users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    const user = users.find(
      (u) =>
        u.credentials.username.toLowerCase() ===
        decoded.user.username.toLowerCase()
    );

    if (!user || !user.active) {
      return res.status(401).json({
        status: "error",
        message: "Пользователь не найден или не активен",
      });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Ошибка верификации токена:", err);
    return res.status(401).json({
      status: "error",
      message: "Недействительный токен",
      details: err.message,
    });
  }
};
