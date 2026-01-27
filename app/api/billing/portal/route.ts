import { requireUser } from "@/app/utils/requireUser";
import { stripe } from "@/app/utils/stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/errors";

export async function POST() {
  const user = await requireUser();

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer ID found" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_URL}/account/billing`,
    });

    logger.info("Billing portal session created", { userId: user.id });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Error creating billing portal session", error, {
      userId: user.id,
    });
    return handleApiError(error);
  }
}
