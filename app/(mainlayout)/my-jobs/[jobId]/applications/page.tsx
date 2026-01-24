import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ jobId: string }>;

export default async function JobApplicationsPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();
  const { jobId } = await params;

  const job = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
    select: {
      jobTitle: true,
      applications: {
        select: {
          id: true,
          name: true,
          email: true,
          resume: true,
          coverLetter: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!job) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{job.jobTitle} Applications</h1>
          <p className="text-sm text-muted-foreground">
            Total applicants: {job.applications.length}
          </p>
        </div>
        <Link
          href="/my-jobs"
          className={buttonVariants({ variant: "outline" })}
        >
          Back to jobs
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <CardDescription>Review recent applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Cover Letter</TableHead>
                <TableHead>Applied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {job.applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    <Link
                      href={app.resume}
                      className="text-primary underline"
                      target="_blank"
                    >
                      View resume
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-md">
                    {app.coverLetter || "—"}
                  </TableCell>
                  <TableCell>
                    {app.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {job.applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No applications yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
