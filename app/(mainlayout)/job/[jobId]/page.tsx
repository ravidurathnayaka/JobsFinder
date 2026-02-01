import prisma from "@/app/utils/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { notFound } from "next/navigation";
import React from "react";

import Image from "next/image";
import { Heart } from "lucide-react";

import Link from "next/link";
import { auth } from "@/app/utils/auth";
import { isAdmin } from "@/app/utils/isAdmin";
import { SaveJobButton } from "@/components/general/SubmitButtons";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { saveJobPost, unsaveJobPost } from "@/app/actions";

import { request } from "@arcjet/next";
import { benefits } from "@/app/utils/listofBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import arcjet, { detectBot } from "@/app/utils/arcjet";
import type { Metadata } from "next";
import { JobViewTracker } from "@/components/general/JobViewTracker";
import { env } from "@/lib/env";
import type { JSONContent } from "@tiptap/react";

/** Get plain text from job description (TipTap JSON or HTML) for meta/structured data */
function getJobDescriptionPlainText(raw: string, maxLength = 150): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as { content?: unknown[]; text?: string };
      const text = extractTextFromTiptap(parsed);
      return text.slice(0, maxLength);
    } catch {
      return stripHtml(trimmed).slice(0, maxLength);
    }
  }
  return stripHtml(trimmed).slice(0, maxLength);
}

function extractTextFromTiptap(
  node: { content?: unknown[]; text?: string }
): string {
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content
      .map((n) => extractTextFromTiptap(n as { content?: unknown[]; text?: string }))
      .join("");
  }
  return "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Parse job description as TipTap JSON or raw HTML */
function parseJobDescription(
  raw: string
): { type: "json"; data: JSONContent } | { type: "html"; data: string } {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as JSONContent;
      if (parsed && (parsed.content !== undefined || parsed.type)) {
        return { type: "json", data: parsed };
      }
    } catch {
      // fall through to html
    }
  }
  return { type: "html", data: raw };
}

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

async function getJob(jobId: string, userId?: string, allowAllStatuses?: boolean) {
  const [jobData, savedJob] = await Promise.all([
    prisma.jobPost.findFirst({
      where: {
        id: jobId,
        ...(allowAllStatuses ? {} : { status: "ACTIVE" }),
      },
      select: {
        jobTitle: true,
        jobDescription: true,

        location: true,

        employmentType: true,
        benefits: true,
        salaryFrom: true,
        salaryTo: true,

        createdAt: true,
        listingDuration: true,
        companyId: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
            website: true,
          },
        },
      },
    }),
    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobId: {
              userId,
              jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }

  return {
    jobData,
    savedJob,
  };
}

type Params = Promise<{ jobId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { jobId } = await params;
  const job = await prisma.jobPost.findFirst({
    where: { id: jobId, status: "ACTIVE" },
    select: {
      jobTitle: true,
      jobDescription: true,
      location: true,
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  const description = getJobDescriptionPlainText(job.jobDescription);
  const metaDescription = `Apply for ${job.jobTitle} at ${job.company.name} in ${job.location}. ${description}`;

  return {
    title: `${job.jobTitle} at ${job.company.name} | JobsFinder`,
    description: metaDescription,
    openGraph: {
      title: `${job.jobTitle} at ${job.company.name}`,
      description: metaDescription,
      type: "website",
      images: job.company.logo ? [job.company.logo] : undefined,
    },
  };
}

const JobIdPage = async ({ params }: { params: Params }) => {
  const { jobId } = await params;
  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  const session = await auth();
  const allowAllStatuses = isAdmin(session?.user?.email);
  const { jobData, savedJob } = await getJob(
    jobId,
    session?.user?.id,
    allowAllStatuses
  );
  const userDataForApply = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { userType: true, email: true },
      })
    : null;
  const showApplyCard =
    !session?.user ||
    userDataForApply?.userType === "JOB_SEEKER" ||
    (userDataForApply?.email ? isAdmin(userDataForApply.email) : false);
  const locationFlag = getFlagEmoji(jobData.location);

  const jobUrl = `${env.NEXT_PUBLIC_URL}/job/${jobId}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: jobData.jobTitle,
    description: getJobDescriptionPlainText(jobData.jobDescription, 5000),
    identifier: {
      "@type": "PropertyValue",
      name: "JobsFinder",
      value: jobId,
    },
    datePosted: jobData.createdAt.toISOString(),
    validThrough: new Date(
      jobData.createdAt.getTime() +
        jobData.listingDuration * 24 * 60 * 60 * 1000
    ).toISOString(),
    employmentType: jobData.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: jobData.company.name,
      sameAs: jobData.company.website || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: jobData.location,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: jobData.salaryFrom,
        maxValue: jobData.salaryTo,
        unitText: "YEAR",
      },
    },
    url: jobUrl,
  };

  return (
    <>
      <JobViewTracker jobId={jobId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{jobData.jobTitle}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">{jobData.company.name}</span>

                <Badge className="rounded-full" variant="secondary">
                  {jobData.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <Badge className="rounded-full">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {jobData.location} Only
                </Badge>
              </div>
            </div>

            {session?.user ? (
              <form
                action={
                  savedJob
                    ? unsaveJobPost.bind(null, savedJob.id)
                    : saveJobPost.bind(null, jobId)
                }
              >
                <SaveJobButton savedJob={!!savedJob} />
              </form>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">
                  <Heart className="size-4 mr-2" />
                  Save Job
                </Link>
              </Button>
            )}
          </div>

          <section>
            {(() => {
              const parsed = parseJobDescription(jobData.jobDescription);
              if (parsed.type === "html") {
                return (
                  <div
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: parsed.data }}
                  />
                );
              }
              return <JsonToHtml json={parsed.data} />;
            })()}
          </section>

          <section>
            <h3 className="font-semibold mb-4">
              Benefits{" "}
              <span className="text-sm text-muted-foreground font-normal">
                (green is offered and red is not offered)
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit) => {
                const isOffered = jobData.benefits.includes(benefit.id);
                return (
                  <Badge
                    key={benefit.id}
                    variant={isOffered ? "default" : "outline"}
                    className={`text-sm px-4 py-1.5 rounded-full ${
                      !isOffered && " opacity-75 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <benefit.icon className="size-4" />
                      {benefit.label}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Now Card - only for job seekers or guests (company users manage jobs, not apply) */}
          {showApplyCard && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apply now</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Please let {jobData.company.name} know you found this job on
                  JobsFinder. This helps us grow!
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href={`/job/${jobId}/apply`}>Apply now</Link>
              </Button>
            </div>
          </Card>
          )}

          {/* Job Details Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">About the job</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Apply before
                  </span>
                  <span className="text-sm">
                    {new Date(
                      jobData.createdAt.getTime() +
                        jobData.listingDuration * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Posted on
                  </span>
                  <span className="text-sm">
                    {jobData.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Employment type
                  </span>
                  <span className="text-sm">{jobData.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                  <Badge variant="secondary">{jobData.location}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    jobData.company.logo ??
                    `https://avatar.vercel.sh/${jobData.company.name}`
                  }
                  alt={jobData.company.name}
                  width={48}
                  height={48}
                  className="rounded-full size-12"
                />
                <div>
                  <h3 className="font-semibold">{jobData.company.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {jobData.company.about}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/company/${jobData.companyId}`}>
                  View company profile
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default JobIdPage;
