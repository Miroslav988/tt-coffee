import express from "express";
import fs from "fs/promises";
import path from "path";
import md5 from "md5";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const sanitizedEmail = email.trim();
  const sanitizedPassword = password.trim();

  try {
    const usersPath = path.resolve("backend/data/users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    const user = users.find(
      (u) =>
        u.credentials.username.toLowerCase() === sanitizedEmail.toLowerCase()
    );

    if (!user || !user.active) {
      return res.status(401).json({ message: "Неправильный email или пароль" });
    }

    const hashedPassword = md5(sanitizedPassword);

    if (hashedPassword !== user.credentials.passphrase) {
      return res.status(401).json({ message: "Неправильный email или пароль" });
    }

    const token = jwt.sign(
      {
        user: {
          username: user.credentials.username,
          name: user.name,
          surname: user.surname,
        },
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );

    res.json({ user, token });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
