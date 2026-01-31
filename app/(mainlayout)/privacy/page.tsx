import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JobsFinder",
  description:
    "Privacy Policy for JobsFinder – how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-US")}
      </p>

      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
          <p className="text-muted-foreground">
            JobsFinder (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a job board
            where companies post jobs and job seekers browse and apply. This
            Privacy Policy explains how we collect, use, and protect your
            information when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground mb-2">
            We collect information you provide and data from your use of our
            services:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>
              <strong>Account data:</strong> When you sign up (e.g. via Google
              or GitHub), we receive your name, email, and profile image from
              the provider.
            </li>
            <li>
              <strong>Company profile:</strong> If you register as a company,
              we store company name, location, about text, logo, website, and
              social links.
            </li>
            <li>
              <strong>Job seeker profile:</strong> If you register as a job
              seeker, we store your name, about text, and resume (uploaded
              file).
            </li>
            <li>
              <strong>Job postings:</strong> Job title, description, location,
              salary range, benefits, and listing duration.
            </li>
            <li>
              <strong>Applications:</strong> Name, email, resume, and cover
              letter when you apply to a job.
            </li>
            <li>
              <strong>Payment data:</strong> Payment for job listings is
              processed by Stripe. We do not store full card numbers; we store
              Stripe customer and payment references as needed for billing and
              receipts.
            </li>
            <li>
              <strong>Usage data:</strong> We may log job views, IP address,
              and user agent for analytics and security.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            3. How We Use Your Information
          </h2>
          <p className="text-muted-foreground mb-2">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Provide, maintain, and improve our job board and services</li>
            <li>Display job postings and company profiles to other users</li>
            <li>Deliver applications to the companies you apply to</li>
            <li>Process payments and send receipts (via Stripe)</li>
            <li>Send transactional emails (e.g. job approval, application
              confirmations) via our email provider</li>
            <li>Respond to support requests and enforce our Terms of Service</li>
            <li>Comply with legal obligations and protect our rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. Third-Party Services
          </h2>
          <p className="text-muted-foreground mb-2">
            We use trusted third parties to operate our service:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>
              <strong>Authentication:</strong> NextAuth with OAuth providers
              (e.g. Google, GitHub) for sign-in.
            </li>
            <li>
              <strong>Payments:</strong> Stripe for payment processing and
              billing.
            </li>
            <li>
              <strong>File storage:</strong> UploadThing for logos, resumes, and
              other uploads.
            </li>
            <li>
              <strong>Email:</strong> Resend (or similar) for transactional
              emails.
            </li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Each provider has its own privacy policy governing how they process
            data. We encourage you to review their policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your account and profile data until you delete your
            account or ask us to remove it. Job postings and applications are
            kept as long as needed to operate the service and comply with legal
            obligations. Payment records may be retained for accounting and tax
            purposes as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
          <p className="text-muted-foreground">
            Depending on where you live, you may have the right to access,
            correct, or delete your personal data, or to object to or restrict
            certain processing. You can update your company or job seeker profile
            in your account settings. To request deletion or exercise other
            rights, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">7. Security</h2>
          <p className="text-muted-foreground">
            We use industry-standard measures to protect your data, including
            HTTPS, secure authentication, and access controls. No method of
            transmission or storage is 100% secure; we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
          <p className="text-muted-foreground">
            For privacy-related questions or requests, contact us at{" "}
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
