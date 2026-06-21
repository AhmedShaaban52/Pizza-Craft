import Navbar from "@/app/(public)/_components/layout/Navbar";
import { ReactNode } from "react";
import Footer from "./_components/layout/Footer";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}