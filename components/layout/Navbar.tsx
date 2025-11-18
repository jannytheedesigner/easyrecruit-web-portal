// components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Bell, Moon, Sun, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Logo } from "oxisverse-logo-system"


export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState("")

  const wallTitle = useMemo(() => {
    if (user?.role === "employer") return "EasyEmployerWall"
    if (user?.role === "jobseeker") return "EasyJobWall"
    return "Dashboard"
  }, [user?.role])

  const navLinks = useMemo(() => {
    if (user?.role === "employer") {
      return [
        { href: "/dashboard/employer", label: "Home" },
        { href: "/dashboard/jobs", label: "Jobs" },
        { href: "/dashboard/users", label: "Talent" },
        { href: "/dashboard/contracts", label: "Contracts" },
        { href: "/dashboard/payments", label: "Payments" },
      ]
    }
    return [
      { href: "/dashboard/jobseeker", label: "Home" },
      { href: "/dashboard/jobs", label: "Find Jobs" },
      { href: "/dashboard/contracts", label: "Contracts" },
      { href: "/dashboard/payments", label: "Earnings" },
    ]
  }, [user?.role])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const target = `/dashboard/jobs?search=${encodeURIComponent(query.trim())}`
    router.push(target)
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/dashboard" className="text-base font-semibold text-primary whitespace-nowrap">
          <Logo
            brandName="easyrecruit"
            type="horizontal"
            variant="main"
            format="svg"
            width={180}
            height={40}
            alt="EasyRecruit Logo"
            className="flex w-[10em]"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname?.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>

      <form onSubmit={onSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-xl mx-4">
        <div className="flex items-center gap-2 w-full bg-background border border-border rounded-lg px-3 h-10">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm font-medium">{wallTitle}</span>
        <button
          onClick={() => setDark((p) => !p)}
          className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <Link
          href="/dashboard/notifications"
          className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || "user"}</p>
          </div>
          <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
