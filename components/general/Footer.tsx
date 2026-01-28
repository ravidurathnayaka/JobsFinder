import { Briefcase, Mail, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="text-primary w-8 h-8" />
              <h2 className="text-primary text-xl font-bold">JobsFinder</h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your dream job or hire the best talent. Connect employers and
              job seekers in one platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
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

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
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
              <li>
                <Link
                  href="/account/company"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@jobsfinder.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
              <li className="flex items-center gap-4 pt-2">
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
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} JobsFinder. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
