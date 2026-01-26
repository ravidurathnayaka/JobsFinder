import { MetadataRoute } from "next";
import prisma from "./utils/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const jobs = await prisma.jobPost.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      updatedAt: true,
    },
    take: 10000,
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
