import { createApp } from "./src/app.js";
import { ensureDatabaseReady, pool } from "./src/config/db.js";
import { initializeEmbeddings } from "./src/services/aiService.js";

const port = Number(process.env.PORT || 8080);

async function start() {
  await ensureDatabaseReady();
  await initializeEmbeddings();

  const app = createApp();
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch(async (error) => {
  console.error("Failed to start backend", error);
  await pool.end().catch(() => {});
  process.exit(1);
});

process.on("SIGINT", async () => {
  await pool.end().catch(() => {});
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end().catch(() => {});
  process.exit(0);
});
