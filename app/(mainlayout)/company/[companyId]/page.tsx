import prisma from "@/app/utils/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ companyId: string }>;

export default async function CompanyProfilePage({
  params,
}: {
  params: Params;
}) {
  const { companyId } = await params;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      about: true,
      logo: true,
      location: true,
      website: true,
      xAccount: true,
      JobPost: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          jobTitle: true,
          employmentType: true,
          location: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50, // Limit active jobs displayed
      },
    },
  });

  if (!company) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src={company.logo ?? `https://avatar.vercel.sh/${company.name}`}
            alt={company.name}
            width={72}
            height={72}
            className="rounded-full size-18"
          />
          <div>
            <h1 className="text-2xl font-semibold">{company.name}</h1>
            <p className="text-sm text-muted-foreground">{company.location}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{company.about}</p>
        <div className="flex flex-wrap gap-2">
          {company.website ? (
            <Link
              href={company.website}
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Website
            </Link>
          ) : null}
          {company.xAccount ? (
            <Link
              href={`https://x.com/${company.xAccount.replace("@", "")}`}
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              X (Twitter)
            </Link>
          ) : null}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Open Roles</h2>
        <div className="space-y-3">
          {company.JobPost.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No open roles right now.
            </p>
          ) : (
            company.JobPost.map((job) => (
              <div
                key={job.id}
                className="flex flex-wrap items-center justify-between gap-3 border rounded-md p-4"
              >
                <div>
                  <Link href={`/job/${job.id}`} className="font-medium">
                    {job.jobTitle}
                  </Link>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{job.employmentType}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
