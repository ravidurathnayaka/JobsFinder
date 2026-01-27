import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/utils/auth";
import { logger } from "@/lib/logger";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || undefined;
  const forwarded = headersList.get("x-forwarded-for");
  const ipAddress = forwarded ? forwarded.split(",")[0].trim() : undefined;

  // Get user ID from session if available (optional)
  const session = await auth();
  const userId = session?.user?.id || null;

  try {
    await prisma.jobView.create({
      data: {
        jobId,
        userId,
        userAgent,
        ipAddress,
      },
    });

    logger.debug("Job view tracked", { jobId, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error tracking job view", error, { jobId });
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
