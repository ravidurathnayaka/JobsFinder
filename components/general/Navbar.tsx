import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth, signOut } from "@/app/utils/auth";

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
      <div className="flex  gap-4">
        <ThemeToggle />
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button>Logout</Button>
          </form>
        ) : (
          <Link
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href={"/login"}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
