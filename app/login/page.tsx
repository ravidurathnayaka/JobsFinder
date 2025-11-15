import Link from "next/link";
import { Briefcase } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center">
          <div className="flex gap-3 justify-center items-center">
            <Briefcase className="text-primary w-10 h-10" />
            <h1 className="text-primary text-2xl font-bold">JobsFinder</h1>
          </div>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
