import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use direct URL for migrations (no pgbouncer)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
