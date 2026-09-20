import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:taskflow.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
