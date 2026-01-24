import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { redirect } from "next/navigation";
import JobSeekerForm from "@/components/forms/onboarding/JobSeekerForm";
import { updateJobSeeker } from "@/app/actions";

export default async function JobSeekerAccountPage() {
  const user = await requireUser();

  const jobSeeker = await prisma.jobSeeker.findUnique({
    where: {
      userId: user.id as string,
    },
    select: {
      name: true,
      about: true,
      resume: true,
    },
  });

  if (!jobSeeker) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <JobSeekerForm
        initialValues={jobSeeker}
        submitAction={updateJobSeeker}
        submitLabel="Update Profile"
        successMessage="Job seeker profile updated."
      />
    </div>
  );
}
