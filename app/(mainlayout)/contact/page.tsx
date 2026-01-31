import type { Metadata } from "next";
import { Mail, Github, Linkedin, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | JobsFinder",
  description:
    "Get in touch with JobsFinder – support, questions, and feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        Have a question or feedback? We&apos;d love to hear from you.
      </p>

      <div className="space-y-8">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">Email</h2>
          <p className="text-muted-foreground text-sm mb-4">
            For support, partnership inquiries, or general questions, reach us
            at:
          </p>
          <a
            href="mailto:support@jobsfinder.com"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Mail className="w-5 h-5" />
            support@jobsfinder.com
          </a>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">Connect on social</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Follow us for updates and job tips.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="X"
            >
              <X className="w-5 h-5" />
            </a>
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          We typically respond within 1–2 business days. For urgent account or
          payment issues, include your email and a short description in your
          message.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t">
        <Link
          href="/"
          className="text-sm text-primary hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
