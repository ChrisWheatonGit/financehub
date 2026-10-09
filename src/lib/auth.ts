import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
export const auth = betterAuth({
 database: prismaAdapter(db, { provider: "postgresql" }),
 emailAndPassword: { enabled: true, minPasswordLength: 12 },
 advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
 trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
