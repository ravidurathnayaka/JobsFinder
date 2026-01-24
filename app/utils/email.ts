import { Resend } from "resend";

const fromAddress =
  process.env.RESEND_FROM_EMAIL || "JobsFinder <onboarding@resend.dev>";

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
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
    console.warn("RESEND_API_KEY is not configured. Skipping email.");
    return;
  }

  await client.emails.send({
    from: fromAddress,
    to: [to],
    subject,
    html,
  });
}
