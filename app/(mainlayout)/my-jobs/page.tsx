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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Briefcase, MoreHorizontal, PenBoxIcon, User2, XCircle } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/general/EmptyState";
import prisma from "@/app/utils/db";

import { requireUser } from "@/app/utils/requireUser";
import { CopyLinkMenuItem } from "@/components/general/CopyLink";
import { env } from "@/lib/env";

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
  const data = await getJobs(session.id as string);

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No job posts found"
          description="You don't have any job posts yet."
          buttonText="Create a job post"
          href="/post-job"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Jobs</CardTitle>
            <CardDescription>
              Manage your job listings and applications here.
            </CardDescription>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/edit`}>
                              <PenBoxIcon className="size-4" />
                              Edit Job
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/analytics`}>
                              <Briefcase className="size-4" />
                              Analytics
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/applications`}>
                              <Briefcase className="size-4" />
                              Applications
                            </Link>
                          </DropdownMenuItem>
                          <CopyLinkMenuItem
                            jobUrl={`${env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                          />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/delete`}>
                              <XCircle className="h-4 w-4" />
                              Delete Job
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
