import { requireUser } from "@/app/utils/requireUser";
import { stripe } from "@/app/utils/stripe";
import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/errors";

export async function POST() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id as string },
    select: { stripeCustomerId: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: { message: "User not found" } },
      { status: 404 }
    );
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: sessionUser.email as string,
        name: (sessionUser.name as string) || undefined,
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: sessionUser.id as string },
        data: { stripeCustomerId: customer.id },
      });
    } catch (error) {
      logger.error("Error creating Stripe customer for billing portal", error, {
        userId: sessionUser.id,
      });
      return handleApiError(error);
    }
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.NEXT_PUBLIC_URL}/account/billing`,
    });

    logger.info("Billing portal session created", { userId: sessionUser.id });
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    logger.error("Error creating billing portal session", error, {
      userId: sessionUser.id,
    });
    return handleApiError(error);
  }
}
