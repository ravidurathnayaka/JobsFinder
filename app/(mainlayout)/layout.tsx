import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import { ReactNode, Suspense } from "react";

function NavbarFallback() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 md:py-4 px-4 sm:px-6 lg:px-8 h-14" />
    </nav>
  );
}

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 w-full pt-4 md:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
