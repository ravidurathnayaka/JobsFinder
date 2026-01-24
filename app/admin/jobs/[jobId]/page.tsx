import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { redirect } from "next/navigation";

type Params = Promise<{ jobId: string }>;

export default async function AdminJobViewPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const { jobId } = await params;

  redirect(`/job/${jobId}`);
}
