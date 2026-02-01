"use client";

import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { UserDropdown } from "./UserDropdown";
import { logoutAction } from "@/app/actions/auth";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  session: {
    user: {
      email: string;
      name: string;
      image: string;
    } | null;
  } | null;
  isAdmin: boolean;
  userType: "COMPANY" | "JOB_SEEKER" | null | undefined;
}

export function MobileMenu({ session, isAdmin, userType }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-mobile-menu]")) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div
            data-mobile-menu
            className="fixed top-0 right-0 h-full w-[300px] sm:w-[400px] bg-background border-l z-50 overflow-y-auto md:hidden animate-in slide-in-from-right duration-300"
          >
            <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {(!session?.user || userType === "COMPANY" || isAdmin) && (
                  <Link
                    href="/post-job"
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full",
                    })}
                    onClick={() => setIsOpen(false)}
                  >
                    Post Job
                  </Link>
                )}

                {session?.user ? (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex flex-col gap-2 mb-4">
                        <p className="text-sm font-medium">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <UserDropdown
                          email={session.user.email}
                          name={session.user.name}
                          image={session.user.image}
                          isAdmin={isAdmin}
                          userType={userType}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full",
                    })}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}

                <div className="border-t pt-4 flex flex-col gap-3">
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Jobs
                  </Link>
                  {session?.user && (
                    <>
                      <Link
                        href="/favorites"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Saved
                      </Link>
                      {(userType === "COMPANY" || isAdmin) && (
                      <Link
                        href="/my-jobs"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        My Jobs
                      </Link>
                      )}
                      {(userType === "COMPANY" || isAdmin) && (
                      <Link
                        href="/account/billing"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Billing
                      </Link>
                      )}
                      {(userType === "COMPANY" || isAdmin) && (
                        <Link
                          href="/account/company"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      {(userType === "JOB_SEEKER" || isAdmin) && (
                        <Link
                          href="/account/jobseeker"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin/jobs"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <form
                        action={logoutAction}
                        className="border-t pt-3 mt-2"
                      >
                        <button
                          type="submit"
                          className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Logout
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
