import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
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
        <Button>Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
