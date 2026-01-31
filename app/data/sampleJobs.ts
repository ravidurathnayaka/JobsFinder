/**
 * Sample job data used for:
 * - Seed script (prisma/seed.ts) when seeding by company name
 * - "Add sample jobs" for the current logged-in company (my-jobs page)
 */
export type SampleJob = {
  jobTitle: string;
  employmentType: string;
  location: string;
  salaryFrom: number;
  salaryTo: number;
  jobDescription: string;
  listingDuration: number;
  benefits: string[];
};

export const SAMPLE_JOBS: SampleJob[] = [
  {
    jobTitle: "Senior Software Engineer - Streaming Platform",
    employmentType: "full-time",
    location: "United States",
    salaryFrom: 200000,
    salaryTo: 300000,
    jobDescription: `<p>Help deliver content to 200+ million members worldwide. We're looking for engineers to build and scale our streaming platform and improve playback quality and reliability.</p><p><strong>Responsibilities:</strong></p><ul><li>Design and implement high-scale distributed systems</li><li>Optimize video encoding and delivery pipelines</li><li>Collaborate with product and content teams</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k", "equity", "unlimited_vacation"],
  },
  {
    jobTitle: "ML Engineer - Recommendations",
    employmentType: "contract",
    location: "Remote",
    salaryFrom: 180000,
    salaryTo: 260000,
    jobDescription: `<p>Improve how members discover content they'll love. Our recommendations team uses ML to personalize the experience across 190+ countries.</p><p><strong>Requirements:</strong></p><ul><li>Experience with recommendation systems or ranking</li><li>Strong Python/Java and Spark or similar</li><li>MS or PhD in ML, statistics, or related field preferred</li></ul>`,
    listingDuration: 60,
    benefits: ["medical", "dental", "401k", "learning_budget", "home_office", "async"],
  },
  {
    jobTitle: "Content Producer - Original Series",
    employmentType: "full-time",
    location: "United Kingdom",
    salaryFrom: 95000,
    salaryTo: 140000,
    jobDescription: `<p>Join the team behind award-winning originals. We're looking for producers to develop and oversee series from pitch to premiere.</p><p><strong>You will:</strong></p><ul><li>Manage production budgets and schedules</li><li>Collaborate with showrunners and talent</li><li>Ensure creative vision and quality standards</li></ul>`,
    listingDuration: 45,
    benefits: ["medical", "dental", "vision", "401k", "unlimited_vacation", "company_retreats"],
  },
  {
    jobTitle: "Security Engineer - Studio & Production",
    employmentType: "full-time",
    location: "United States",
    salaryFrom: 180000,
    salaryTo: 250000,
    jobDescription: `<p>Protect our content and production systems. Help secure pre-release titles, studio workflows, and partner integrations.</p><p><strong>Qualifications:</strong></p><ul><li>Experience in application or infrastructure security</li><li>Familiarity with cloud security (AWS/GCP)</li><li>Strong scripting and automation skills</li></ul>`,
    listingDuration: 14,
    benefits: ["medical", "dental", "401k", "equity", "learning_budget", "no_monitoring"],
  },
  {
    jobTitle: "Data Engineer - Analytics",
    employmentType: "part-time",
    location: "Canada",
    salaryFrom: 120000,
    salaryTo: 180000,
    jobDescription: `<p>Build the data pipelines that power decisions. Work on petabyte-scale data and real-time analytics used by product, content, and engineering.</p><p><strong>Responsibilities:</strong></p><ul><li>Design and maintain ETL and data models</li><li>Improve data quality and availability</li><li>Partner with analysts and scientists</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "vision", "401k_matching", "async", "distributed"],
  },
  {
    jobTitle: "Product Design Intern - Member Experience",
    employmentType: "internship",
    location: "United States",
    salaryFrom: 45000,
    salaryTo: 65000,
    jobDescription: `<p>Summer internship on the Member Experience team. Help design flows and experiments that improve how people discover and enjoy content.</p><p><strong>You will:</strong></p><ul><li>Support senior designers on A/B tests and prototypes</li><li>Conduct user research and synthesize insights</li><li>Present work to cross-functional partners</li></ul>`,
    listingDuration: 30,
    benefits: ["medical", "dental", "learning_budget", "home_office"],
  },
];
