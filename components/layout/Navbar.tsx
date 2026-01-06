// components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Bell, Moon, Sun, Search, PowerOff, CirclePowerIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Logo } from "oxisverse-logo-system"
import { getRoleBasePath, getRoleDashboardPath } from "@/lib/roleRoutes"


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

  const basePath = getRoleBasePath(user?.role)
  const homeHref = getRoleDashboardPath(user?.role)

  const navLinks = useMemo(() => {
    if (user?.role === "employer") {
      return [
        { href: `${basePath}/dashboard`, label: "Overview" },
        { href: `${basePath}/jobs`, label: "Jobs" },
        { href: `${basePath}/candidates`, label: "Candidates" },
        { href: `${basePath}/hires`, label: "Hires" },
        { href: `${basePath}/assessments`, label: "Assessments" },
      ]
    }
    return [
      { href: `${basePath}/dashboard`, label: "Overview" },
      { href: `${basePath}/jobs`, label: "Find Jobs" },
      { href: `${basePath}/applications`, label: "My Applications" },
      { href: `${basePath}/contracts`, label: "Contracts" },
      { href: `${basePath}/cvs`, label: "CVs & Resumes" },
    ]
  }, [basePath, user?.role])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const target = `${basePath}/jobs?search=${encodeURIComponent(query.trim())}`
    router.push(target)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href={homeHref} className="text-base font-semibold text-primary whitespace-nowrap">
          <Logo
            brandName="easyrecruit"
            type="horizontal"
            variant="main"
            format="svg"
            width={180}
            height={40}
            alt="EasyRecruit Logo"
            className="flex w-[8em]"
            priority
          />
        </Link>

      </div>
      <div className="max-w-5xl mx-auto flex flex-row">
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname?.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-5 text-sm border-b-4 transition-colors hover:text-gray-600 ${active ? "bg-none border-b-4 border-er-primary font-medium text-er-primary-dark" : "border-er-primary/0 hover:border-b-accent hover:text-accent-foreground"
                  }`}
              >
                {l.label}
              </Link>
            )
          })}
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
      </div>


      <div className="flex items-center gap-3">
        <Link
          href={`${basePath}/notifications`}
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
            <CirclePowerIcon className="text-red-500" />
          </button>
        </div>
      </div>
    </header>
  )
}
