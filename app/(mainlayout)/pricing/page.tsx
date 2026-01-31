import type { Metadata } from "next";
import Link from "next/link";
import { jobListingDurationPricing } from "@/app/utils/pricingTiers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | JobsFinder",
  description: "Job listing pricing – post jobs and reach candidates.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Pricing</h1>
        <p className="text-muted-foreground">
          Simple pricing for job listings. Pay once, list for 30, 60, or 90 days.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {jobListingDurationPricing.map((tier) => (
          <Card key={tier.days} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.days} days</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <p className="text-3xl font-bold mt-2">
                ${tier.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  one-time
                </span>
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  Job visible for {tier.days} days
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  Applications to your inbox
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  Edit or manage anytime
                </li>
              </ul>
              <Button asChild className="mt-auto w-full">
                <Link href="/post-job">Post a job</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">
        All plans include one job listing. No subscription – pay per listing.
      </p>
    </div>
  );
}
