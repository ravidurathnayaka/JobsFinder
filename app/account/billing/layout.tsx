import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import prisma from "@/app/utils/db";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function BillingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id as string },
    select: { userType: true, email: true },
  });
  const admin = userRecord?.email ? isAdmin(userRecord.email) : false;
  if (userRecord?.userType === "JOB_SEEKER" && !admin) {
    redirect("/");
  }
  return <>{children}</>;
}
