import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL!,
  },
});


// drizzle config file (tell drizzle where schema is, what db is used, how to connect to it)