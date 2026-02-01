import { unstable_cache } from "next/cache";
import { auth } from "@/app/utils/auth";
import { PaginationComponent } from "./PaginationComponent";
import { JobCard } from "./JobCard";
import prisma from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobPostStatus } from "@/lib/generated/prisma/client";

// Maximum page size to prevent memory issues
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 5;

// Cache job list; revalidate when jobs go live via revalidateTag("jobs") (1s so list updates quickly)
const CACHE_REVALIDATE_SECONDS = 1;

async function getJobsUncached(
  page: number,
  pageSize: number,
  jobTypes: string[],
  location: string,
  search: string,
  minSalary: string,
  maxSalary: string
) {
  const safePageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * safePageSize;

  const searchTerm = search.trim();
  const cleanJobTypes = jobTypes.filter(Boolean);
  const min = minSalary ? parseInt(minSalary, 10) : undefined;
  const max = maxSalary ? parseInt(maxSalary, 10) : undefined;
  const isFullSalaryRange = min === 0 && max === 500_000;
  const hasSalaryFilter =
    !isFullSalaryRange &&
    min != null &&
    !Number.isNaN(min) &&
    max != null &&
    !Number.isNaN(max);

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(searchTerm && {
      jobTitle: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    }),
    ...(cleanJobTypes.length > 0 && cleanJobTypes.length < 4 && {
      employmentType: {
        in: cleanJobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
    ...(hasSalaryFilter && {
      salaryFrom: { lte: max },
      salaryTo: { gte: min },
    }),
  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      skip,
      take: safePageSize,
      where,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({ where }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / safePageSize),
    currentPage: safePage,
  };
}

function getJobs(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  jobTypes: string[] = [],
  location: string = "",
  search: string = "",
  minSalary: string = "",
  maxSalary: string = ""
) {
  const key = `jobs:${page}:${pageSize}:${jobTypes.join(",")}:${location}:${search}:${minSalary}:${maxSalary}`;
  return unstable_cache(
    () =>
      getJobsUncached(
        page,
        pageSize,
        jobTypes,
        location,
        search,
        minSalary,
        maxSalary
      ),
    [key],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["jobs"] }
  )();
}

interface JobListingsProps {
  currentPage: number;
  search: string;
  jobTypes: string[];
  location: string;
  minSalary?: string;
  maxSalary?: string;
}

export default async function JobListings({
  currentPage,
  search,
  jobTypes,
  location,
  minSalary = "",
  maxSalary = "",
}: JobListingsProps) {
  const [session, { jobs, totalPages, currentPage: page }] = await Promise.all([
    auth(),
    getJobs(
      currentPage,
      DEFAULT_PAGE_SIZE,
      jobTypes,
      location,
      search,
      minSalary,
      maxSalary
    ),
  ]);

  const appliedJobIds =
    session?.user?.id != null
      ? (
          await prisma.application.findMany({
            where: { userId: session.user.id as string },
            select: { jobId: true },
          })
        ).map((a) => a.jobId)
      : [];

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard
              job={job}
              key={job.id}
              applied={appliedJobIds.includes(job.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}

      <div className="flex justify-center mt-6">
        <PaginationComponent totalPages={totalPages} currentPage={page} />
      </div>
    </>
  );
}
