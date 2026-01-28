import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
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
        select: { userType: true },
      })
    : null;

  return (
    <nav className="flex justify-between items-center py-4 md:py-5 shadow-sm mb-12 md:mb-20 w-full px-4 md:px-6 lg:px-8">
      <Link href={"/"}>
        <div className="flex gap-2 md:gap-3 justify-center items-center">
          <Briefcase className="text-primary w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-primary text-xl md:text-2xl font-bold">JobsFinder</h1>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
          Post Job
        </Link>
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
    </nav>
  );
};

export default Navbar;
