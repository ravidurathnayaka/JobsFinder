import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JobsFinder",
  description:
    "Terms of Service for JobsFinder – rules and guidelines for using our job board.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-US")}
      </p>

      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Agreement</h2>
          <p className="text-muted-foreground">
            By using JobsFinder (&quot;the Service&quot;), you agree to these Terms of
            Service. If you do not agree, do not use the Service. We may update
            these terms from time to time; continued use after changes
            constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Description of Service</h2>
          <p className="text-muted-foreground">
            JobsFinder is a job board that allows companies to post job
            listings and job seekers to browse jobs and submit applications. We
            provide the platform only; we are not an employer or recruiter. Job
            postings and hiring decisions are the responsibility of the
            companies that post them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Accounts</h2>
          <p className="text-muted-foreground mb-2">
            To post jobs or apply, you must create an account (e.g. via Google
            or GitHub). You must:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Provide accurate and complete information</li>
            <li>Keep your account credentials secure</li>
            <li>Notify us of any unauthorized use of your account</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            You are responsible for all activity under your account. We may
            suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Job Postings (Companies)</h2>
          <p className="text-muted-foreground mb-2">
            If you post jobs as a company:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>You must have the right to recruit for the positions you post</li>
            <li>Job listings must be accurate and not misleading</li>
            <li>You must pay the applicable listing fee (e.g. via Stripe) for
              your job to go live after approval</li>
            <li>Job posts may be reviewed by our team; we may approve, reject, or
              remove listings that violate our policies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Applications (Job Seekers)</h2>
          <p className="text-muted-foreground">
            When you apply to a job, your name, email, resume, and cover letter
            are shared with the company that posted the job. That company is
            responsible for how it uses your data. We do not guarantee responses
            or hiring outcomes. Do not submit false or misleading information
            in your applications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Payments</h2>
          <p className="text-muted-foreground">
            Fees for job listings are charged at the time of posting. Payments
            are processed by Stripe. Refunds and billing disputes are handled
            according to our refund policy and Stripe&apos;s terms. All fees are
            in the currency and at the rates shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">7. Prohibited Conduct</h2>
          <p className="text-muted-foreground mb-2">You must not:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Post false, discriminatory, or illegal job listings</li>
            <li>Impersonate others or misrepresent your identity or
              affiliation</li>
            <li>Scrape, automate access, or overload our systems without
              permission</li>
            <li>Use the Service for spam, fraud, or any unlawful purpose</li>
            <li>Circumvent payment, approval, or access controls</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            We may remove content and suspend or terminate accounts that
            violate these rules.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">8. Intellectual Property</h2>
          <p className="text-muted-foreground">
            JobsFinder and its branding are owned by us. You retain ownership of
            content you submit (e.g. job descriptions, resumes). By submitting
            content, you grant us a license to use, display, and distribute it
            as needed to operate the Service (e.g. showing job posts to users,
            sending applications to companies).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">9. Disclaimer</h2>
          <p className="text-muted-foreground">
            The Service is provided &quot;as is&quot;. We do not guarantee
            availability, accuracy of job listings, or hiring outcomes. We are
            not responsible for the conduct of companies or job seekers, or for
            decisions made based on content on the platform. Use the Service at
            your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">10. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, JobsFinder and its
            operators shall not be liable for any indirect, incidental, special,
            or consequential damages arising from your use of the Service,
            including loss of data, revenue, or employment opportunities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:support@jobsfinder.com"
              className="text-primary underline"
            >
              support@jobsfinder.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
