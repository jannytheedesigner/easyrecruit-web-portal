"use client";

import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEasyCV = pathname?.startsWith("/jobseeker/cvs");

  if (isEasyCV) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(238,198,67,0.15),_transparent_30%),linear-gradient(135deg,_#f8faff_0%,_#f3f6ff_100%)] dark:bg-er-primary-dark">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(238,198,67,0.15),_transparent_30%),linear-gradient(135deg,_#f8faff_0%,_#f3f6ff_100%)] text-slate-900 dark:bg-er-primary">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
