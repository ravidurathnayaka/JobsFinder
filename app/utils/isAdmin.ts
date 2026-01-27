import { env } from "@/lib/env";

export function isAdmin(email?: string | null) {
  if (!email) {
    return false;
  }

  const adminEmails = env.ADMIN_EMAILS?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails || adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}
