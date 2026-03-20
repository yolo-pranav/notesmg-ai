import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../config/db.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  const username = req.body?.username?.trim();
  const password = req.body?.password;

  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  try {
    const existingUser = await prisma.appUser.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      res.status(400).send("Username already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.appUser.create({
      data: {
        username,
        password: passwordHash,
        role: "USER"
      }
    });

    res.send("User registered successfully");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const username = req.body?.username?.trim();
  const password = req.body?.password;

  if (!username || !password) {
    res.status(401).send("Invalid credentials");
    return;
  }

  try {
    const user = await prisma.appUser.findUnique({
      where: { username }
    });

    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      res.status(401).send("Invalid credentials");
      return;
    }

    req.session.user = {
      id: Number(user.id),
      username: user.username,
      role: user.role
    };

    req.session.save((error) => {
      if (error) {
        next(error);
        return;
      }

      res.send("Login successful");
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

export default router;
