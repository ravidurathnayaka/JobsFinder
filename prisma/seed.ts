import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { JobPostStatus } from "../lib/generated/prisma/client";
import { SAMPLE_JOBS } from "../app/data/sampleJobs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Add it to your .env file.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedJob = {
  jobTitle: string;
  employmentType: string;
  location: string;
  salaryFrom: number;
  salaryTo: number;
  jobDescription: string;
  listingDuration: number;
  benefits: string[];
};

const APPLE_JOBS: SeedJob[] = [
  {
    jobTitle: "iOS Software Engineer",
    employmentType: "full-time",
    location: "United States",
    salaryFrom: 190000,
    salaryTo: 280000,
    jobDescription: `<p>Build the next generation of iOS apps used by billions. Work on frameworks and apps that power iPhone, iPad, and more.</p><p><strong>Requirements:</strong></p><ul><li>Strong Swift/Objective-C and system design</li><li>Passion for performance and user experience</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k", "equity", "unlimited_vacation"],
  },
  {
    jobTitle: "Hardware Engineering Intern",
    employmentType: "internship",
    location: "United States",
    salaryFrom: 50000,
    salaryTo: 72000,
    jobDescription: `<p>12-week summer internship in hardware engineering. Contribute to product development and prototyping.</p><p><strong>You will:</strong></p><ul><li>Support design and validation of components</li><li>Collaborate with cross-functional teams</li></ul>`,
    listingDuration: 14,
    benefits: ["medical", "dental", "learning_budget", "home_office"],
  },
  {
    jobTitle: "Retail Creative - Part Time",
    employmentType: "part-time",
    location: "United Kingdom",
    salaryFrom: 28000,
    salaryTo: 35000,
    jobDescription: `<p>Support the retail experience in Apple Stores. Help customers discover products and run workshops.</p><p><strong>Responsibilities:</strong></p><ul><li>Deliver exceptional customer experience</li><li>Lead Today at Apple sessions</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "learning_budget", "pto"],
  },
];

async function seedJobsForCompany(companyName: string, jobs: SeedJob[]) {
  const company = await prisma.company.findFirst({
    where: {
      name: { equals: companyName, mode: "insensitive" },
    },
    select: { id: true, name: true },
  });

  if (!company) {
    console.log(`Skipping "${companyName}" – no company with that name found.`);
    return 0;
  }

  const { count } = await prisma.jobPost.createMany({
    data: jobs.map((job) => ({
      companyId: company.id,
      status: JobPostStatus.ACTIVE,
      ...job,
    })),
  });

  console.log(`Created ${count} job(s) for ${company.name}.`);
  return count;
}

async function main() {
  let total = 0;
  total += await seedJobsForCompany("Apple", APPLE_JOBS);
  total += await seedJobsForCompany("Netflix", SAMPLE_JOBS);

  if (total === 0) {
    throw new Error(
      'No companies named "Apple" or "Netflix" found. Create a company account with one of those names first, then run this seed again.'
    );
  }

  console.log(`Done. Total jobs created: ${total}.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
