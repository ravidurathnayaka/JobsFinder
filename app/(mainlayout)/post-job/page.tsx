import CreateJobForm from "@/components/forms/CreateJobForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/utils/requireUser";
import prisma from "@/app/utils/db";

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
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

  if (!data) {
    return redirect("/");
  }
  return data;
}

const page = async () => {
  const session = await requireUser();
  const data = await getCompany(session.id as string);
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
