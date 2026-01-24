import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { notFound, redirect } from "next/navigation";
import { EditJobForm } from "@/components/forms/EditJobForm";
import { adminUpdateJobPost } from "@/app/actions";

async function getJobPost(jobId: string) {
  const jobPost = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
    },
    select: {
      benefits: true,
      id: true,
      jobTitle: true,
      jobDescription: true,
      salaryTo: true,
      salaryFrom: true,
      location: true,
      employmentType: true,
      listingDuration: true,
      company: {
        select: {
          about: true,
          name: true,
          location: true,
          website: true,
          xAccount: true,
          logo: true,
        },
      },
    },
  });

  if (!jobPost) {
    return null;
  }

  return jobPost;
}

type Params = Promise<{ jobId: string }>;

export default async function AdminEditJobPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const { jobId } = await params;
  const jobPost = await getJobPost(jobId);

  if (!jobPost) {
    return notFound();
  }

  return <EditJobForm jobPost={jobPost} updateAction={adminUpdateJobPost} />;
}
