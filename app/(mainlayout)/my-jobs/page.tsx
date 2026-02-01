import React from "react";

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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";

import { EmptyState } from "@/components/general/EmptyState";
import prisma from "@/app/utils/db";

import { requireUser } from "@/app/utils/requireUser";
import { isAdmin } from "@/app/utils/isAdmin";
import { addSampleJobs, deleteJobPost } from "@/app/actions";
import { MyJobRowActions } from "@/components/general/MyJobRowActions";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";

// Maximum jobs to fetch per user (prevent memory issues)
const MAX_USER_JOBS = 1000;

async function getJobs(userId: string) {
  const data = await prisma.jobPost.findMany({
    where: {
      company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
      _count: {
        select: {
          Application: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: MAX_USER_JOBS, // Limit to prevent memory issues
  });

  return data;
}

const MyJobs = async () => {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { userType: true, email: true },
  });
  const admin = user?.email ? isAdmin(user.email) : false;
  if (user?.userType === "JOB_SEEKER" && !admin) {
    redirect("/");
  }
  const data = await getJobs(session.id as string);

  return (
    <>
      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-6">
          <EmptyState
            title="No job posts found"
            description="You don't have any job posts yet."
            buttonText="Create a job post"
            href="/post-job"
          />
          <form action={addSampleJobs}>
            <Button type="submit" variant="outline" size="lg">
              Add sample jobs (like Netflix)
            </Button>
          </form>
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>My Jobs</CardTitle>
              <CardDescription>
                Manage your job listings and applications here.
              </CardDescription>
            </div>
            <form action={addSampleJobs}>
              <Button type="submit" variant="outline" size="sm">
                Add sample jobs
              </Button>
            </form>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">Logo</TableHead>
                      <TableHead className="hidden md:table-cell">Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Applicants</TableHead>
                      <TableHead className="hidden md:table-cell">Created On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="hidden sm:table-cell">
                          {listing.company.logo ? (
                            <Image
                              src={listing.company.logo}
                              alt={`${listing.company.name} logo`}
                              width={40}
                              height={40}
                              className="rounded-md size-10"
                            />
                          ) : (
                            <div className="bg-red-500 size-10 rounded-lg flex items-center justify-center">
                              <User2 className="size-6 text-white" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="hidden md:inline">{listing.company.name}</span>
                            <span className="md:hidden">{listing.jobTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{listing.jobTitle}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                            {listing.status.charAt(0).toUpperCase() +
                              listing.status.slice(1).toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm font-medium">
                            {listing._count.Application} application
                            {listing._count.Application !== 1 ? "s" : ""}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {listing.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <MyJobRowActions
                            jobId={listing.id}
                            jobTitle={listing.jobTitle}
                            jobUrl={`${env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                            deleteAction={deleteJobPost}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MyJobs;
