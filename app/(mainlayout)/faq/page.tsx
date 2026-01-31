import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ | JobsFinder",
  description: "Frequently asked questions about JobsFinder.",
};

const faqs = [
  {
    q: "How do I post a job?",
    a: "Sign in (or register with Google or GitHub), complete your company profile if needed, then go to Post a Job. Fill in the job details, choose a listing duration (30, 60, or 90 days), and pay via Stripe. After payment and optional admin approval, your job goes live.",
  },
  {
    q: "How do I apply to a job?",
    a: "Open the job page and click Apply now. Sign in if needed, then submit your name, email, resume (upload), and optional cover letter. The company receives your application and can contact you directly.",
  },
  {
    q: "What does it cost to post a job?",
    a: "We charge per listing: $99 for 30 days, $179 for 60 days, or $249 for 90 days. Payment is one-time via Stripe. There is no subscription.",
  },
  {
    q: "Can I edit or remove my job after posting?",
    a: "Yes. From My Jobs you can edit, view applications, or delete a listing. Edits take effect immediately. Deleted jobs are removed from the board.",
  },
  {
    q: "How do I save jobs to apply later?",
    a: "Sign in and open any job page. Click Save Job. Your saved jobs appear under Saved Jobs (or Favorites) in the menu.",
  },
  {
    q: "Who can see my application?",
    a: "Only the company that posted the job sees your name, email, resume, and cover letter. We do not share your data with other employers.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Frequently asked questions</h1>
        <p className="text-muted-foreground">
          Common questions about posting jobs and applying.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {faq.a}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
