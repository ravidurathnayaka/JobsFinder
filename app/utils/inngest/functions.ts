import prisma from "../db";
import { inngest } from "./client";
import { sendEmail } from "../email";
import { env } from "@/lib/env";

export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration" },
  { event: "job/created" },
  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data;

    const isDev = process.env.NODE_ENV !== "production";
    const enableInDev = process.env.ENABLE_JOB_EXPIRATION_IN_DEV === "true";

    if (isDev && !enableInDev) {
      return { jobId, message: "Skipped in development - jobs stay ACTIVE" };
    }

    // In dev with ENABLE_JOB_EXPIRATION_IN_DEV, use short duration so you can test (~2 min total)
    const effectiveDays = isDev ? 0.0015 : expirationDays; // ~2 min in dev
    const sleepForExpiringSoon = effectiveDays > 3 ? `${Math.max(0.001, effectiveDays - 3)}d` : null;
    const sleepAfterExpiringSoon = effectiveDays > 3 ? (isDev ? "0.001d" : "3d") : null;

    if (effectiveDays > 3 && sleepForExpiringSoon) {
      await step.sleep("wait-for-expiring-soon", sleepForExpiringSoon);

      await step.run("send-expiring-soon-email", async () => {
        const job = await prisma.jobPost.findUnique({
          where: { id: jobId },
          select: {
            id: true,
            jobTitle: true,
            status: true,
            company: {
              select: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        });

        if (job?.status === "ACTIVE" && job.company.user.email) {
          const jobUrl = `${env.NEXT_PUBLIC_URL}/job/${job.id}`;
          await sendEmail({
            to: job.company.user.email,
            subject: "Your job post is expiring soon",
            html: `<p>Your job post <strong>${job.jobTitle}</strong> will expire in 3 days.</p><p><a href="${jobUrl}">View job post</a></p>`,
          });
        }
      });

      await step.sleep("wait-for-expiration", sleepAfterExpiringSoon!);
    } else {
      await step.sleep("wait-for-expiration", `${effectiveDays}d`);
    }

    await step.run("update-job-status", async () => {
      const updated = await prisma.jobPost.updateMany({
        where: { id: jobId, status: "ACTIVE" },
        data: { status: "EXPIRED" },
      });

      if (updated.count === 0) {
        return;
      }

      const job = await prisma.jobPost.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          jobTitle: true,
          company: {
            select: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      if (job?.company.user.email) {
        await sendEmail({
          to: job.company.user.email,
          subject: "Your job post has expired",
          html: `<p>Your job post <strong>${job.jobTitle}</strong> has expired.</p>`,
        });
      }
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

      if (recentJobs.length > 0 && email) {
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

          await sendEmail({
            to: email,
            subject: "Latest job opportunities for you",
            html: `${jobListingsHTML}`,
          });
        });
      }
    }

    return { userId, message: "Completed 30 day job listing notifications" };
  }
);

export const sendJobSeekerWelcome = inngest.createFunction(
  { id: "jobseeker-welcome" },
  { event: "jobseeker/created" },
  async ({ event, step }) => {
    const { email, name } = event.data;

    if (!email) {
      return { message: "No email available for welcome message" };
    }

    await step.run("send-welcome-email", async () => {
      await sendEmail({
        to: email,
        subject: "Welcome to JobsFinder",
        html: `<p>Hi ${name || "there"}, welcome to JobsFinder! We'll keep you updated with new job opportunities.</p>`,
      });
    });

    return { message: "Welcome email sent" };
  }
);
