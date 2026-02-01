import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { inngest } from "@/app/utils/inngest/client";
import { headers } from "next/headers";
import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error("Stripe webhook signature verification failed", error);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const jobId = session.metadata?.jobId;

    if (!jobId) {
      logger.error("No job ID found in Stripe session metadata", undefined, {
        sessionId: session.id,
      });
      return new Response("No job ID found in session metadata", { status: 400 });
    }

    const result = await prisma.jobPost.updateMany({
      where: {
        id: jobId,
        status: "DRAFT",
      },
      data: {
        status: "ACTIVE",
      },
    });

    // Always send job/created so it appears in Inngest dev UI; expiration logic is gated inside the Inngest function (dev vs prod).
    if (result.count > 0) {
      const job = await prisma.jobPost.findUnique({
        where: { id: jobId },
        select: { listingDuration: true },
      });
      if (job?.listingDuration) {
        await inngest.send({
          name: "job/created",
          data: { jobId, expirationDays: job.listingDuration },
        });
      }
    }

    revalidateTag("jobs", "max");
    revalidatePath("/", "page");
  }

  return new Response(null, { status: 200 });
}
