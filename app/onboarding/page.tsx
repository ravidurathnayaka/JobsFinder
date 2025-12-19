import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/requireUser";
import prisma from "../utils/db";

async function checkIfOnboardingCompleted(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingCompleted: true,
    },
  });

  if (user?.onboardingCompleted === true) {
    redirect("/");
  }
}

const Onboarding = async () => {
  const session = await requireUser();
  await checkIfOnboardingCompleted(session.id as string);
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  );
};

export default Onboarding;
