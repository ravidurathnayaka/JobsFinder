import { Briefcase } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";
import { isAdmin } from "@/app/utils/isAdmin";
import prisma from "@/app/utils/db";
import { MobileMenu } from "./MobileMenu";

const Navbar = async () => {
  const session = await auth();
  const userData = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { userType: true, email: true },
      })
    : null;
  const admin = session?.user?.email ? isAdmin(session.user.email) : false;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="mx-auto flex justify-between items-center py-3 md:py-4 px-4 sm:px-6 lg:px-8">
        <Link href={"/"} className="flex gap-2 md:gap-3 items-center shrink-0">
          <Briefcase className="text-primary w-8 h-8 md:w-9 md:h-9" />
          <h1 className="text-primary text-xl md:text-2xl font-bold tracking-tight">
            JobsFinder
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {(!session?.user || userData?.userType === "COMPANY" || admin) && (
            <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
              Post Job
            </Link>
          )}
          {session?.user ? (
            <UserDropdown
              email={session.user.email as string}
              name={session.user.name as string}
              image={session.user.image as string}
              isAdmin={isAdmin(session.user.email)}
              userType={userData?.userType}
            />
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <MobileMenu
            session={
              session?.user
                ? {
                    user: {
                      email: session.user.email as string,
                      name: session.user.name as string,
                      image: session.user.image as string,
                    },
                  }
                : null
            }
            isAdmin={isAdmin(session?.user?.email || "")}
            userType={userData?.userType}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
