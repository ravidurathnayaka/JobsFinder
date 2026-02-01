import CreateJobForm from "@/components/forms/CreateJobForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import prisma from "@/app/utils/db";

async function getCompany(userId: string) {
  return prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });
}

const page = async () => {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { userType: true, email: true },
  });
  const admin = user?.email ? isAdmin(user.email) : false;
  if (user?.userType === "JOB_SEEKER" && !admin) {
    redirect("/");
  }
  const data = await getCompany(session.id as string);
  if (!data) {
    if (admin) redirect("/account/company");
    redirect("/");
  }
  return (
    <div className="w-full mt-5">
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyLogo={data.logo}
        companyName={data.name}
        companyXAccount={data.xAccount}
        companyWebsite={data.website}
      />
    </div>
  );
};

export default page;
