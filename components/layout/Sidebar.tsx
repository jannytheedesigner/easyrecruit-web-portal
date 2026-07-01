"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Home, Briefcase, Users, FileText, Wallet, Bell, BarChart3, User } from "lucide-react";
import { getRoleBasePath } from "@/lib/roleRoutes";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const basePath = getRoleBasePath(user?.role);
  const links =
    user?.role === "employer"
      ? [
        { href: `${basePath}/dashboard`, label: "Dashboard", icon: Home },
        { href: `${basePath}/jobs`, label: "Jobs", icon: Briefcase },
        { href: `${basePath}/users`, label: "Candidates", icon: Users },
        { href: `${basePath}/contracts`, label: "Contracts", icon: FileText },
        { href: `${basePath}/payments`, label: "Payments", icon: Wallet },
        { href: `${basePath}/wallet`, label: "Wallet", icon: Wallet },
        { href: `${basePath}/notifications`, label: "Notifications", icon: Bell },
        { href: `${basePath}/reports`, label: "Reports", icon: BarChart3 },
      ]
      : [
        { href: `${basePath}/dashboard`, label: "Dashboard", icon: Home },
        { href: `${basePath}/jobs`, label: "Find Jobs", icon: Briefcase },
        { href: `${basePath}/contracts`, label: "Contracts", icon: FileText },
        { href: `${basePath}/payments`, label: "Earnings", icon: Wallet },
        { href: `${basePath}/notifications`, label: "Notifications", icon: Bell },
      ];

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200/70 bg-[linear-gradient(180deg,_#f8faff_0%,_#ffffff_100%)] p-5 shadow-[0_20px_45px_-24px_rgba(13,33,161,0.26)] lg:flex">
      <div className="mb-8 rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-er-primary">Portal</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">EasyRecruit</h1>
        <p className="mt-1 text-sm text-slate-600">Modern hiring, simplified.</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${isActive
                ? "bg-er-primary text-white shadow-lg shadow-er-primary/20"
                : "text-slate-600 hover:bg-er-primary/10 hover:text-er-primary"
                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href={`${basePath}/settings`}
        className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 text-sm font-medium text-slate-700 transition-all hover:border-er-primary/30 hover:bg-er-primary/10 hover:text-er-primary"
      >
        <User className="h-5 w-5" />
        <span>Settings</span>
      </Link>
    </aside>
  );
}
