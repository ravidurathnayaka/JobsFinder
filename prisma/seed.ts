import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { JobPostStatus } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Add it to your .env file.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const APPLE_JOBS = [
  {
    jobTitle: "Senior iOS Software Engineer",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 180000,
    salaryTo: 250000,
    jobDescription: `<p>Join the team that builds the world's most advanced mobile operating system. We're looking for an experienced iOS engineer to work on system frameworks and apps used by billions.</p><p><strong>Responsibilities:</strong></p><ul><li>Design and implement new features for iOS</li><li>Collaborate with cross-functional teams</li><li>Mentor junior engineers</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k", "equity", "learning_budget"],
  },
  {
    jobTitle: "Machine Learning Engineer - Siri",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 200000,
    salaryTo: 280000,
    jobDescription: `<p>Help shape the future of intelligent assistants. Our Siri team is looking for ML engineers to improve on-device intelligence and privacy-preserving models.</p><p><strong>Requirements:</strong></p><ul><li>MS or PhD in ML, CS, or related field</li><li>Experience with TensorFlow or PyTorch</li><li>Strong Python and C++ skills</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "401k", "equity", "learning_budget", "home_office"],
  },
  {
    jobTitle: "Software Engineer - Cloud Services",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 160000,
    salaryTo: 220000,
    jobDescription: `<p>Build the infrastructure that powers iCloud, App Store, and Apple's ecosystem. We need engineers who care about scale, reliability, and security.</p><p><strong>You will:</strong></p><ul><li>Design and operate distributed systems</li><li>Improve performance and cost efficiency</li><li>Participate in on-call rotation</li></ul>`,
    listingDuration: 60,
    benefits: ["medical", "dental", "vision", "401k_matching", "equity", "pto"],
  },
  {
    jobTitle: "UI/UX Designer - Human Interface",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 140000,
    salaryTo: 190000,
    jobDescription: `<p>Create intuitive and beautiful experiences across Apple platforms. The Human Interface team sets the design language for iOS, macOS, watchOS, and tvOS.</p><p><strong>Qualifications:</strong></p><ul><li>Portfolio demonstrating end-to-end product design</li><li>Proficiency in Figma and prototyping tools</li><li>Strong communication and presentation skills</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k", "unlimited_vacation", "company_retreats"],
  },
  {
    jobTitle: "Hardware Validation Engineer",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 150000,
    salaryTo: 200000,
    jobDescription: `<p>Ensure the quality of Apple's next-generation hardware. You'll develop test strategies and automation for chips, sensors, and devices.</p><p><strong>Responsibilities:</strong></p><ul><li>Define validation plans for new products</li><li>Build automated test systems</li><li>Analyze failures and drive root cause</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "401k", "equity", "gym", "learning_budget"],
  },
];

const NETFLIX_JOBS = [
  {
    jobTitle: "Senior Software Engineer - Streaming Platform",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 200000,
    salaryTo: 300000,
    jobDescription: `<p>Help deliver content to 200+ million members worldwide. We're looking for engineers to build and scale our streaming platform and improve playback quality and reliability.</p><p><strong>Responsibilities:</strong></p><ul><li>Design and implement high-scale distributed systems</li><li>Optimize video encoding and delivery pipelines</li><li>Collaborate with product and content teams</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k", "equity", "unlimited_vacation"],
  },
  {
    jobTitle: "ML Engineer - Recommendations",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 220000,
    salaryTo: 320000,
    jobDescription: `<p>Improve how members discover content they'll love. Our recommendations team uses ML to personalize the Netflix experience across 190+ countries.</p><p><strong>Requirements:</strong></p><ul><li>Experience with recommendation systems or ranking</li><li>Strong Python/Java and Spark or similar</li><li>MS or PhD in ML, statistics, or related field preferred</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "401k", "equity", "learning_budget", "home_office"],
  },
  {
    jobTitle: "Content Producer - Original Series",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 120000,
    salaryTo: 180000,
    jobDescription: `<p>Join the team behind award-winning originals. We're looking for producers to develop and oversee series from pitch to premiere.</p><p><strong>You will:</strong></p><ul><li>Manage production budgets and schedules</li><li>Collaborate with showrunners and talent</li><li>Ensure creative vision and quality standards</li></ul>`,
    listingDuration: 60,
    benefits: ["medical", "dental", "vision", "401k", "unlimited_vacation", "company_retreats"],
  },
  {
    jobTitle: "Security Engineer - Studio & Production",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 180000,
    salaryTo: 250000,
    jobDescription: `<p>Protect our content and production systems. Help secure pre-release titles, studio workflows, and partner integrations.</p><p><strong>Qualifications:</strong></p><ul><li>Experience in application or infrastructure security</li><li>Familiarity with cloud security (AWS/GCP)</li><li>Strong scripting and automation skills</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "401k", "equity", "learning_budget", "no_monitoring"],
  },
  {
    jobTitle: "Data Engineer - Analytics",
    employmentType: "Full-time",
    location: "United States",
    salaryFrom: 170000,
    salaryTo: 240000,
    jobDescription: `<p>Build the data pipelines that power decisions across Netflix. Work on petabyte-scale data and real-time analytics used by product, content, and engineering.</p><p><strong>Responsibilities:</strong></p><ul><li>Design and maintain ETL and data models</li><li>Improve data quality and availability</li><li>Partner with analysts and scientists</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k_matching", "equity", "async"],
  },
];

async function seedJobsForCompany(companyName: string, jobs: typeof APPLE_JOBS) {
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
  total += await seedJobsForCompany("Netflix", NETFLIX_JOBS);

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
