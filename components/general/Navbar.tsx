import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";
import { isAdmin } from "@/app/utils/isAdmin";
import prisma from "@/app/utils/db";

const Navbar = async () => {
  const session = await auth();
  const userData = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { userType: true },
      })
    : null;

  return (
    <nav className="flex justify-between items-center py-5">
      <Link href={"/"}>
        <div className="flex gap-3 justify-center items-center">
          <Briefcase className="text-primary w-10 h-10" />
          <h1 className="text-primary text-2xl font-bold">JobsFinder</h1>
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
    </nav>
  );
};

export default Navbar;
