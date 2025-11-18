"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Home, Briefcase, Users, FileText, Wallet, Bell, BarChart3, User } from "lucide-react";

const employerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/users", label: "Candidates", icon: Users },
  { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

const jobseekerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/jobs", label: "Find Jobs", icon: Briefcase },
  { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
  { href: "/dashboard/payments", label: "Earnings", icon: Wallet },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = user?.role === "employer" ? employerLinks : jobseekerLinks;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">EasyRecruit</h1>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/profile"
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent mt-auto"
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </Link>
    </aside>
  );
}