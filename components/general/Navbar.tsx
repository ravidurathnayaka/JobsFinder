import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth, signOut } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";

const Navbar = async () => {
  const session = await auth();
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
