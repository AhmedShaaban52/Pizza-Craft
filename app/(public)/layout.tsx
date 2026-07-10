import Navbar from "@/app/(public)/_components/layout/Navbar";
import { ReactNode } from "react";
import Footer from "./_components/layout/Footer";
import { LocaleProvider } from "@/context/locale-context";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-neutral-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}