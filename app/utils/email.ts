import { Resend } from "resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { ExternalServiceError } from "@/lib/errors";

const fromAddress =
  env.RESEND_FROM_EMAIL || "JobsFinder <onboarding@resend.dev>";

function getClient() {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getClient();
  if (!client) {
    logger.warn("Email sending skipped - RESEND_API_KEY not configured");
    return;
  }

  try {
    await client.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
    });

    logger.info("Email sent successfully", { to, subject });
  } catch (error) {
    logger.error("Failed to send email", error, { to, subject });
    throw new ExternalServiceError("Resend", "Failed to send email", error as Error);
  }
}
