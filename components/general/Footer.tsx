import { Briefcase } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-muted/50">
      <div className="w-full mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Left: JobsFinder + description */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity"
          >
            <Briefcase className="w-5 h-5 text-primary shrink-0" />
            <span className="font-semibold">JobsFinder</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Find your dream job or hire the best talent.
          </p>
        </div>
        {/* Right: Copyright */}
        <p className="text-sm text-muted-foreground shrink-0">
          © {currentYear} JobsFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
