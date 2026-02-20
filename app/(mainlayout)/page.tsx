import { JobFilters } from "@/components/general/JobFilters";
import { HeroSearch } from "@/components/general/HeroSearch";
import JobListings from "@/components/general/JobListings";
import JobListingsLoading from "@/components/general/JobListingsLoading";
import { Suspense } from "react";

type SearchParamsProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    jobTypes?: string;
    location?: string;
    minSalary?: string;
    maxSalary?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = params.search?.trim() || "";
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";
  const minSalary = params.minSalary?.trim() || "";
  const maxSalary = params.maxSalary?.trim() || "";

  const filterKey = `page=${currentPage};search=${search};types=${jobTypes.join(
    ","
  )};location=${location};min=${minSalary};max=${maxSalary}`;

  return (
    <>
      <HeroSearch />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <JobFilters />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Suspense key={filterKey} fallback={<JobListingsLoading />}>
            <JobListings
              currentPage={currentPage}
              search={search}
              jobTypes={jobTypes}
              location={location}
              minSalary={minSalary}
              maxSalary={maxSalary}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
