import dotenv from "dotenv";
import pg from "pg";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const { Pool } = pg;

// Connection pool primarily maintained for express-session (connect-pg-simple)
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "notesmg"
});

// Prisma Client for application logic
export const prisma = new PrismaClient();

// Monkey-patch BigInt to avoid TypeError: Do not know how to serialize a BigInt
BigInt.prototype.toJSON = function () {
  return Number(this);
};

export async function ensureDatabaseReady() {
  // Rely on Prisma schema synchronizations/migrations moving forward.
  await prisma.$connect();
}
