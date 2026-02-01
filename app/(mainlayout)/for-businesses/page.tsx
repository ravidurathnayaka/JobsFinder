import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "For Businesses | JobsFinder",
  description: "Post jobs, reach candidates, and hire with JobsFinder.",
};

export default function ForBusinessesPage() {
  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">For Businesses</h1>
        <p className="text-muted-foreground text-lg">
          Post jobs, reach qualified candidates, and hire faster.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/post-job">Post a job</Link>
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Briefcase className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Simple job posting</CardTitle>
            <CardDescription>
              Add title, description, salary, and benefits. Choose 30, 60, or 90 days. Pay once and go live.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Reach job seekers</CardTitle>
            <CardDescription>
              Your listing appears in search and filters. Candidates apply with resume and cover letter directly to you.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Zap className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Manage in one place</CardTitle>
            <CardDescription>
              View applications, edit or pause listings, and update your company profile from My Jobs and your account.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Shield className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Secure payments</CardTitle>
            <CardDescription>
              Payments are processed by Stripe. No subscription – pay per job. Refunds follow our terms and Stripe policies.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
