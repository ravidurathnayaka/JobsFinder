import { Slice } from "lucide-react";
import prisma from "../db";
import { inngest } from "./client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration" },
  { event: "job/created" },
  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data;

    // Wait for the specified duration
    await step.sleep("wait-for-expiration", `${expirationDays}d`);

    // Update job status to expired
    await step.run("update-job-status", async () => {
      await prisma.jobPost.update({
        where: { id: jobId },
        data: { status: "EXPIRED" },
      });
    });

    return { jobId, message: "Job marked as expired" };
  }
);

export const sendPeriodicJobListings = inngest.createFunction(
  { id: "send-job-listings" },
  { event: "jobseeker/created" },
  async ({ event, step }) => {
    const { userId, email } = event.data;

    const totalDays = 30;
    const intervalDays = 2;
    let currentDay = 0;

    while (currentDay < totalDays) {
      await step.sleep("wait-interval", `${intervalDays}d`);
      currentDay += intervalDays;

      const recentJobs = await step.run("fetch-recent-jobs", async () => {
        return await prisma.jobPost.findMany({
          where: { status: "ACTIVE" },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        });
      });

      if (recentJobs.length > 0) {
        await step.run("send-email", async () => {
          const jobListingsHTML = recentJobs
            .map(
              (job) =>
                ` <div style="margin-bottom:20px; padding:15px; border:1px solid #eee; border-radius:5px">
                  <h1 style="margin:0;">${job.jobTitle}</h1>
                  <p style="margin:5px 0"> ${job.company.name} * ${
                  job.location
                }</p>
                  <p style="margin:5px;">$${job.salaryFrom.toLocaleString()} - $${job.salaryTo.toLocaleString()}</p>
                </div>`
            )
            .join("");

          await resend.emails.send({
            from: "JobsFinder <onboarding@resend.dev>",
            to: ["rmrhrathnayaka@gmail.com"],
            subject: "Latest Job opportunities for you",
            html: `${jobListingsHTML}`,
          });
        });
      }
    }

    return { userId, message: "Completed 30 day job listing notifications" };
  }
);
