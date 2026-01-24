import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { redirect } from "next/navigation";
import CompanyForm from "@/components/forms/onboarding/CompanyForm";
import { updateCompany } from "@/app/actions";

export default async function CompanyAccountPage() {
  const user = await requireUser();

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
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <CompanyForm
        initialValues={company}
        submitAction={updateCompany}
        submitLabel="Update Profile"
        successMessage="Company profile updated."
      />
    </div>
  );
}
