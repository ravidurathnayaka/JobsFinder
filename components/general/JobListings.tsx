import { PaginationComponent } from "./PaginationComponent";
import { JobCard } from "./JobCard";
import prisma from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobPostStatus } from "@/lib/generated/prisma/client";

// Maximum page size to prevent memory issues
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;

async function getJobs(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  jobTypes: string[] = [],
  location: string = ""
) {
  // Enforce maximum page size
  const safePageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * safePageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
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

export default async function JobListings({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) {
  const {
    jobs,
    totalPages,
    currentPage: page,
  } = await getJobs(currentPage, DEFAULT_PAGE_SIZE, jobTypes, location);

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job, index) => (
            <JobCard job={job} key={index} />
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
