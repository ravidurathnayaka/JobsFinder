import { MetadataRoute } from "next";
import prisma from "./utils/db";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_URL;

  // Sitemap limit per Google's recommendations (50,000 URLs max)
  const SITEMAP_LIMIT = 50000;

  const jobs = await prisma.jobPost.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      updatedAt: true,
    },
    take: SITEMAP_LIMIT,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/job/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...jobUrls,
  ];
}
