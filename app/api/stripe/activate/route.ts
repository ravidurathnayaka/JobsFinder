import prisma from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/email";
import { inngest } from "@/app/utils/inngest/client";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const sessionId =
    req.nextUrl.searchParams.get("session_id") ||
    (await req.json().catch(() => ({}))).session_id;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const jobId = session.metadata?.jobId;

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
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

    if (result.count > 0) {
      const job = await prisma.jobPost.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          jobTitle: true,
          company: {
            select: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          listingDuration: true,
        },
      });

      const companyEmail = job?.company.user.email;
      if (companyEmail) {
        const jobUrl = `${env.NEXT_PUBLIC_URL}/job/${job.id}`;
        await sendEmail({
          to: companyEmail,
          subject: "Your job post is live",
          html: `<p>Your payment was successful and your job post <strong>${job.jobTitle}</strong> is now active.</p><p><a href="${jobUrl}">View job post</a></p>`,
        });
      }

      if (job?.listingDuration) {
        await inngest.send({
          name: "job/created",
          data: {
            jobId,
            expirationDays: job.listingDuration,
          },
        });
      }
    }

    logger.info("Job activated from Stripe checkout", {
      jobId,
      sessionId,
      updatedCount: result.count,
    });

    return NextResponse.json({
      ok: true,
      updatedCount: result.count,
      jobId,
    });
  } catch (error) {
    logger.error("Failed to activate job from checkout session", error, {
      sessionId,
    });
    return NextResponse.json(
      { error: "Failed to activate job" },
      { status: 500 }
    );
  }
}
