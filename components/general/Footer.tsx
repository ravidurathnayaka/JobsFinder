import { Briefcase, Mail, Github, Linkedin, X } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted mt-20">
      <div className="w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="text-primary w-8 h-8" />
              <h2 className="text-primary text-xl font-bold">JobsFinder</h2>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Find your dream job or hire the best talent.
            </p>
          </div>

          {/* Jobs */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Jobs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">For Businesses</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/for-businesses"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  For Businesses
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/my-jobs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Legal */}
          <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4">Help & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-border w-full md:w-auto">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X"
              >
                <X className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} JobsFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
