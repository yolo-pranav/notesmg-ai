import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { pool } from "./config/db.js";
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

dotenv.config();

const PgSession = connectPgSimple(session);

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:80",
        "http://localhost:3000",
        "http://127.0.0.1:80",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:4173"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    })
  );

  app.use(express.json());
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "notes-app-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/notes", notesRouter);

  app.use((err, _req, res, _next) => {
    console.error(err);

    if (err.message === "Origin not allowed by CORS") {
      res.status(403).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
