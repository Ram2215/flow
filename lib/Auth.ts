import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return await bcrypt.hash(password, SALT_ROUNDS);
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },

  trustedOrigins: [
    "http://localhost:*",
    "http://127.0.0.1:*",
  ],

  experimental: {
    joins: true,
  },

  plugins: [nextCookies()],
});