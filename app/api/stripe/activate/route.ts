import prisma from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      ok: true,
      updatedCount: result.count,
      jobId,
    });
  } catch (error) {
    console.error("Failed to activate job from checkout session", error);
    return NextResponse.json(
      { error: "Failed to activate job" },
      { status: 500 }
    );
  }
}
