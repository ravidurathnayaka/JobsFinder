import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { redirect } from "next/navigation";
import CompanyForm from "@/components/forms/onboarding/CompanyForm";
import { updateCompany, createCompanyProfile } from "@/app/actions";

export default async function CompanyAccountPage() {
  const user = await requireUser();

  const userRecord = await prisma.user.findUnique({
    where: { id: user.id as string },
    select: { userType: true, email: true },
  });
  const admin = userRecord?.email ? isAdmin(userRecord.email) : false;
  if (userRecord?.userType === "JOB_SEEKER" && !admin) {
    redirect("/");
  }

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id as string,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      website: true,
      xAccount: true,
    },
  });

  if (!company) {
    if (admin) {
      return (
        <div className="container mx-auto py-8 max-w-3xl">
          <p className="text-muted-foreground mb-6">
            Create a company profile to post jobs. You can use Post Job after
            saving.
          </p>
          <CompanyForm
            submitAction={createCompanyProfile}
            submitLabel="Create company profile"
            successMessage="Company profile created. You can now post jobs."
          />
        </div>
      );
    }
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <CompanyForm
        initialValues={{
          ...company,
          xAccount: company.xAccount ?? undefined,
        }}
        submitAction={updateCompany}
        submitLabel="Update Profile"
        successMessage="Company profile updated."
      />
    </div>
  );
}
