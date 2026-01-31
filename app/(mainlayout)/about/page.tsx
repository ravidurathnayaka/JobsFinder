import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | JobsFinder",
  description: "About JobsFinder – connecting job seekers and employers.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About JobsFinder</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          JobsFinder is a job board that connects companies and job seekers. Companies
          can post jobs, manage applications, and build a company profile. Job
          seekers can browse jobs, save favorites, and apply with a resume and
          cover letter.
        </p>
        <p>
          We focus on a simple flow: post a job, pay per listing, and receive
          applications. No long-term contracts or complex pricing. We use
          trusted tools for payments (Stripe), authentication (Google, GitHub),
          and file uploads so the platform stays reliable and secure.
        </p>
        <p>
          Whether you&apos;re hiring or looking for your next role, JobsFinder is
          designed to make the process straightforward.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/">Browse jobs</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/post-job">Post a job</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
