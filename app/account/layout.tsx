import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
