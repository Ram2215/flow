import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./db/auth-schema.ts", "./db/orders-schema.ts", "./db/customer_schema.ts", "./db/brand-schema.ts", "./db/product-schema.ts","./db/category-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});