"use server";

import z from "zod";
import { requireUser } from "./utils/requireUser";
import {
  applicationSchema,
  companySchema,
  jobSchema,
  jobSeekerSchema,
} from "./utils/zodSchemas";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "@/components/ui/arcjet";
import { request } from "@arcjet/next";
import prisma from "./utils/db";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/pricingTiers";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";
import { isAdmin } from "./utils/isAdmin";
import { JobPostStatus } from "@/lib/generated/prisma/client";
import { sendEmail } from "./utils/email";
import { logger } from "@/lib/logger";
import { ValidationError, NotFoundError, AuthorizationError } from "@/lib/errors";
import { env } from "@/lib/env";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new AuthorizationError("Request denied by security rules");
  }

  const user = await requireUser();

  const validatedData = companySchema.parse(data);

  logger.debug("Creating company profile", { userId: user.id });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  await inngest.send({
    name: "jobseeker/created",
    data: {
      userId: user.id,
      email: user.email,
      name: validatedData.name,
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new AuthorizationError("Request denied by security rules");
  }

  const user = await requireUser();

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let striptCustomerId = company.user.stripeCustomerId;

  if (!striptCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });

    striptCustomerId = customer.id;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
    select: {
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new ValidationError("Invalid listing duration selected");
  }

  const session = await stripe.checkout.sessions.create({
    customer: striptCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://jmyeuvh18b.ufs.sh/f/sCte0LaH65aoE5wnysUyzgkseRtY0cKPUF4xrWHhqCZ9QIAw",
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: jobPost.id,
    },
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}

export async function updateJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await requireUser();

  const validatedData = jobSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  return redirect("/my-jobs");
}

export async function deleteJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
  });

  return redirect("/my-jobs");
}

export async function saveJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.savedJobPost.create({
    data: {
      jobId: jobId,
      userId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}`);
}

export async function unsaveJobPost(savedJobPostId: string) {
  const user = await requireUser();

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string,
    },
    select: {
      jobId: true,
    },
  });

  revalidatePath(`/job/${data.jobId}`);
}

export async function adminApproveJob(jobId: string) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    throw new Error("Forbidden");
  }

  const job = await prisma.jobPost.update({
    where: {
      id: jobId,
    },
    data: {
      status: JobPostStatus.ACTIVE,
    },
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

  const companyEmail = job.company.user.email;
  if (companyEmail) {
    const jobUrl = `${env.NEXT_PUBLIC_URL}/job/${job.id}`;
    await sendEmail({
      to: companyEmail,
      subject: "Your job post has been approved",
      html: `<p>Your job post <strong>${job.jobTitle}</strong> has been approved and is now live.</p><p><a href="${jobUrl}">View job post</a></p>`,
    });
  }

  revalidatePath("/admin/jobs");
}

export async function adminRejectJob(jobId: string) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    throw new Error("Forbidden");
  }

  const job = await prisma.jobPost.update({
    where: {
      id: jobId,
    },
    data: {
      status: JobPostStatus.REJECTED,
    },
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

  const companyEmail = job.company.user.email;
  if (companyEmail) {
    await sendEmail({
      to: companyEmail,
      subject: "Your job post was rejected",
      html: `<p>Your job post <strong>${job.jobTitle}</strong> was rejected. Please review the content and try again.</p>`,
    });
  }

  revalidatePath("/admin/jobs");
}

export async function adminUpdateJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin/jobs");
}

export async function adminDeleteJobPost(jobId: string) {
  const user = await requireUser();

  if (!isAdmin(user.email)) {
    throw new Error("Forbidden");
  }

  await prisma.jobPost.delete({
    where: {
      id: jobId,
    },
  });

  revalidatePath("/admin/jobs");
}

export async function updateCompany(data: z.infer<typeof companySchema>) {
  const user = await requireUser();
  const validatedData = companySchema.parse(data);

  await prisma.company.update({
    where: {
      userId: user.id,
    },
    data: {
      ...validatedData,
    },
  });

  revalidatePath("/account/company");
}

export async function updateJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();
  const validatedData = jobSeekerSchema.parse(data);

  await prisma.jobSeeker.update({
    where: {
      userId: user.id,
    },
    data: {
      ...validatedData,
    },
  });

  revalidatePath("/account/jobseeker");
}

export async function applyToJob(
  jobId: string,
  data: z.infer<typeof applicationSchema>
) {
  const user = await requireUser();
  const validatedData = applicationSchema.parse(data);  await prisma.application.create({
    data: {
      jobId,
      userId: user.id,
      name: validatedData.name,
      email: validatedData.email,
      resume: validatedData.resume,
      coverLetter: validatedData.coverLetter,
    },
  });  revalidatePath(`/job/${jobId}`);
}
