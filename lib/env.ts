/**
 * Environment Variable Validation
 * 
 * This module validates all environment variables at application startup.
 * If any required variables are missing or invalid, the application will fail fast
 * with a clear error message.
 */

import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_URL: z.string().url("NEXT_PUBLIC_URL must be a valid URL"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Authentication
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // File Upload
  UPLOADTHING_TOKEN: z.string().min(1, "UPLOADTHING_TOKEN is required"),
  UPLOADTHING_SECRET: z.string().optional(),

  // Security
  ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),

  // Payments
  SECRET_STRIPE_KEY: z.string().min(1, "SECRET_STRIPE_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),

  // Email
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  RESEND_FROM_EMAIL: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const trimmed = String(val).trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z
      .string()
      .email("RESEND_FROM_EMAIL must be a valid email")
      .optional()
  ),

  // Admin
  ADMIN_EMAILS: z.string().optional(),

  // Inngest (optional for local dev)
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => {
      return `  - ${err.path.join(".")}: ${err.message}`;
    });

    throw new Error(
      `❌ Invalid environment variables:\n${errors.join("\n")}\n\n` +
        "Please check your .env file and ensure all required variables are set."
    );
  }

  return parsed.data;
}

// Validate and export environment variables
export const env = validateEnv();

// Type-safe environment variable access
export function getEnv(): Env {
  return env;
}

// Helper functions for common checks
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
