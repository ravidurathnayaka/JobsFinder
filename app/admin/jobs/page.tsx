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
import { PaginationComponent } from "@/components/general/PaginationComponent";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ShieldCheck, Briefcase } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 10;

type SearchParamsProps = {
  searchParams: Promise<{ page?: string }>;
};

async function getJobs(page: number = 1, pageSize: number = PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;

  const [jobs, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
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
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.jobPost.count(),
  ]);

  return {
    jobs,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: safePage,
  };
}

export default async function AdminJobsPage({ searchParams }: SearchParamsProps) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { jobs, totalCount, totalPages, currentPage: page } = await getJobs(
    currentPage,
    PAGE_SIZE
  );

  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Page header */}
      <div className="flex flex-col gap-1 py-6 md:py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link
            href="/"
            className="text-sm hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-sm font-medium text-foreground">
            Admin · Jobs
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Job moderation
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Approve, reject, or manage job posts
              </p>
            </div>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-dashed flex-1">
          <CardContent className="flex flex-col items-center justify-center min-h-[320px] py-12">
            <EmptyState
              title="No job posts found"
              description="There are no job posts to review yet."
              buttonText="Back to homepage"
              href="/"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden rounded-xl border shadow-sm">
            <CardHeader className="border-b bg-muted/30 px-4 py-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    All job posts
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Showing {from}–{to} of {totalCount} jobs
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="size-4" />
                  <span>{totalCount} total</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="font-semibold text-muted-foreground py-4 pl-6">
                      Company
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">
                      Job title
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">
                      Created
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow
                      key={job.id}
                      className="group border-b last:border-0 transition-colors"
                    >
                      <TableCell className="py-4 pl-6 font-medium">
                        {job.company.name}
                      </TableCell>
                      <TableCell className="py-4">
                        <Link
                          href={`/job/${job.id}`}
                          className="hover:underline hover:text-primary font-medium"
                        >
                          {job.jobTitle}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4">
                        <AdminStatusBadge status={job.status} />
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        {job.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <AdminJobActions jobId={job.id} jobTitle={job.jobTitle} status={job.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 pb-8">
              <PaginationComponent
                totalPages={totalPages}
                currentPage={page}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
