"use client";

import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, User2, Send, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";
import Image from "next/image";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";

interface iAppProps {
  job: {
    id: string;
    jobTitle: string;
    salaryFrom: number;
    salaryTo: number;
    employmentType: string;
    location: string;
    createdAt: Date;
    company: {
      logo: string | null;
      name: string;
      about: string;
      location: string;
    };
  };
  applied?: boolean;
}

export function JobCard({ job, applied = false }: iAppProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary relative">
      <CardHeader className="space-y-4">
        <Link href={`/job/${job.id}`} className="block focus:outline-none">
          <div className="flex flex-col md:flex-row gap-4">
            {job.company.logo ? (
              <Image
                src={job.company.logo}
                alt={job.company.name}
                width={48}
                height={48}
                className="size-12 rounded-lg"
              />
            ) : (
              <div className="bg-red-500 size-12 rounded-lg flex items-center justify-center">
                <User2 className="size-6 text-white" />
              </div>
            )}
            <div className="flex flex-col grow gap-2">
              <h1 className="text-xl md:text-2xl font-bold hover:underline">
                {job.jobTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {job.company.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <Badge className="rounded-full" variant="secondary">
                  {job.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <Badge className="rounded-full">{job.location}</Badge>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} -
                  {formatCurrency(job.salaryTo)}
                </p>
              </div>
            </div>

            <div className="md:ml-auto">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <h1 className="text-base md:text-lg font-semibold whitespace-nowrap">
                  {job.location}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground md:text-right">
                {formatRelativeTime(job.createdAt)}
              </p>
            </div>
          </div>
          <div className="mt-5!">
            <p className="text-base text-muted-foreground line-clamp-2">
              {job.company.about}
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          {applied ? (
            <Button variant="secondary" size="sm" className="gap-1.5" disabled>
              <CheckCircle className="size-4" />
              Applied
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="gap-1.5">
              <Link href={`/job/${job.id}/apply`}>
                <Send className="size-4" />
                Apply
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/job/${job.id}`}>View details</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
