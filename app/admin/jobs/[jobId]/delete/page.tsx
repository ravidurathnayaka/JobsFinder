import { adminDeleteJobPost } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { GeneralSubmitButton } from "@/components/general/SubmitButtons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Params = Promise<{ jobId: string }>;

export default async function AdminDeleteJobPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const { jobId } = await params;

  return (
    <Card className="max-w-lg mx-auto w-full">
      <CardHeader>
        <CardTitle>Are you absolutely sure?</CardTitle>
        <CardDescription>
          This action cannot be undone. This will permanently delete the job
          post.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-4">
        <Link
          href={`/admin/jobs`}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeftIcon className="size-4" />
          Cancel
        </Link>
        <form
          action={async () => {
            "use server";
            await adminDeleteJobPost(jobId);
            redirect("/admin/jobs");
          }}
        >
          <GeneralSubmitButton
            text="Delete Job"
            variant="destructive"
            icon={<Trash2Icon className="size-4" />}
          />
        </form>
      </CardFooter>
    </Card>
  );
}
