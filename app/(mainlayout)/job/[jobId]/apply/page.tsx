import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { notFound } from "next/navigation";
import { ApplyJobForm } from "@/components/forms/ApplyJobForm";
import { applicationSchema } from "@/app/utils/zodSchemas";

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

  const jobSeeker = await prisma.jobSeeker.findUnique({
    where: {
      userId: user.id as string,
    },
    select: {
      name: true,
      resume: true,
    },
  });

  const defaultValues: typeof applicationSchema._type = {
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
