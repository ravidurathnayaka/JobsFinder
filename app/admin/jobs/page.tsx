import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminJobActions } from "@/components/admin/AdminJobActions";
import { EmptyState } from "@/components/general/EmptyState";

const MAX_ADMIN_JOBS = 1000; // Limit to prevent memory issues

async function getJobs() {
  return prisma.jobPost.findMany({
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      company: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: MAX_ADMIN_JOBS,
  });
}

export default async function AdminJobsPage() {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const jobs = await getJobs();

  return (
    <div className="container mx-auto py-8">
      {jobs.length === 0 ? (
        <EmptyState
          title="No job posts found"
          description="There are no job posts to review yet."
          buttonText="Back to homepage"
          href="/"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Admin Job Moderation</CardTitle>
            <CardDescription>Approve or reject job posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.company.name}</TableCell>
                    <TableCell>{job.jobTitle}</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>
                      {job.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminJobActions jobId={job.id} status={job.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
