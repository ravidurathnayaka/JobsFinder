import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ApplyJobForm } from "@/components/forms/ApplyJobForm";
import { z } from "zod";
import { applicationSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

type Params = Promise<{ jobId: string }>;

export default async function ApplyJobPage({ params }: { params: Params }) {
  const user = await requireUser();
  const { jobId } = await params;

  const job = await prisma.jobPost.findFirst({
    where: {
      id: jobId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      jobTitle: true,
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!job) {
    return notFound();
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: user.id as string },
    select: { userType: true, email: true },
  });
  const admin = userRecord?.email ? isAdmin(userRecord.email) : false;
  if (userRecord?.userType === "COMPANY" && !admin) {
    redirect(`/job/${jobId}`);
  }

  const existingApplication = await prisma.application.findUnique({
    where: { userId_jobId: { userId: user.id as string, jobId } },
  });

  if (existingApplication) {
    return (
      <div className="container mx-auto py-8 max-w-2xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Apply for {job.jobTitle}</h1>
          <p className="text-sm text-muted-foreground">{job.company.name}</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <CardTitle>Already applied</CardTitle>
            </div>
            <CardDescription>
              You have already submitted an application for this job.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const jobSeeker = await prisma.jobSeeker.findUnique({
    where: {
      userId: user.id as string,
    },
    select: {
      name: true,
      resume: true,
    },
  });

  const defaultValues: z.infer<typeof applicationSchema> = {
    name: jobSeeker?.name || user.name || "",
    email: user.email || "",
    resume: jobSeeker?.resume || "",
    coverLetter: "",
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Apply for {job.jobTitle}</h1>
        <p className="text-sm text-muted-foreground">{job.company.name}</p>
      </div>
      <ApplyJobForm jobId={job.id} defaultValues={defaultValues} />
    </div>
  );
}
