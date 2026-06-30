"use client";

import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEasyCV = pathname?.startsWith("/jobseeker/cvs");

  if (isEasyCV) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-er-primary-dark">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-100 dark:bg-er-primary">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}