// components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Bell, Moon, Sun, Search, PowerOff, CirclePowerIcon, Wallet, ChevronDown, Settings, LogOut } from "lucide-react"
import { formatCurrency } from "@/lib/helpers"
import axiosClient from "@/lib/axiosClient"
import { useMemo, useState, useRef, useEffect } from "react"
import { Logo } from "oxisverse-logo-system"
import { getRoleBasePath, getRoleDashboardPath } from "@/lib/roleRoutes"


export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (pathname?.startsWith("/jobseeker/cvs")) {
    return null
  }
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const wallTitle = useMemo(() => {
    if (user?.role === "employer") return "EasyEmployerWall"
    if (user?.role === "jobseeker") return "EasyJobWall"
    return "Dashboard"
  }, [user?.role])

  const basePath = getRoleBasePath(user?.role)
  const homeHref = getRoleDashboardPath(user?.role)

  const navLinks = useMemo(() => {
    if (user?.role === "admin") {
      return [
        { href: `${basePath}/dashboard`, label: "Overview" },
        { href: `${basePath}/verifications`, label: "Verifications" },
        { href: `${basePath}/moderation`, label: "Moderation" },
        { href: `${basePath}/financials`, label: "Financials" },
      ]
    }
    if (user?.role === "employer") {
      return [
        { href: `${basePath}/dashboard`, label: "Overview" },
        { href: `${basePath}/jobs`, label: "Find Talent" },
        { href: `${basePath}/candidates`, label: "Candidates" },
        { href: `${basePath}/hires`, label: "Recruitment" },
        { href: `${basePath}/assessments`, label: "Assessments" },
      ]
    }
    return [
      { href: `${basePath}/jobs`, label: "Find Jobs" },
      { href: `${basePath}/applications`, label: "My Applications" },
      { href: `${basePath}/contracts`, label: "Contracts" },
      { href: `${basePath}/dashboard`, label: "Overview" },
      { href: `${basePath}/cvs`, label: "CVs & Resumes" },
    ]
  }, [basePath, user?.role])

  const [balance, setBalance] = useState<number | null>(null)

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfileOpen])

  useState(() => {
    if (user) {
      axiosClient.get("/wallet/balance").then(res => {
        setBalance(res.data.data?.balance || 0)
      }).catch(() => setBalance(0))
    }
  })

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const target = `${basePath}/jobs?search=${encodeURIComponent(query.trim())}`
    router.push(target)
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-100 border-b container mx-auto border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href={homeHref} className="text-base py-3 px-4 bg-er-white rounded-full font-semibold text-primary whitespace-nowrap">
          <Logo
            brandName="easyrecruit"
            type="horizontal"
            variant="secondary"
            format="svg"
            width={180}
            height={40}
            alt="EasyRecruit Logo"
            className="flex w-[7em]"
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
        {/* {user && user.role !== 'admin' && (
          <Link
            href={`${basePath}/wallet`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-er-primary/10 text-er-primary-dark rounded-full border border-er-primary/20 hover:bg-er-primary/20 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-bold whitespace-nowrap">
              {balance !== null ? formatCurrency(balance) : "..."}
            </span>
          </Link>
        )} */}
        <Link
          href={`${basePath}/notifications`}
          className="w-9 h-9 rounded-full bg-white text-accent-foreground flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            aria-label="Profile menu"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-er-primary to-er-primary-dark flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-border z-50">
              {/* Profile Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-er-primary to-er-primary-dark flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{user?.name || "User"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-xs text-muted-foreground">Online for messages</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                <Link
                  href={`/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                  Your profile
                </Link>

                <Link
                  href={`/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Stats and trends
                </Link>

                <Link
                  href={`/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account health
                </Link>

                <Link
                  href={`/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Membership plan
                </Link>

                {/* Theme Selector */}
                <div className="px-4 py-2.5 hover:bg-accent/50 transition-colors">
                  <button
                    className="w-full flex items-center justify-between text-sm text-foreground"
                    onClick={() => setDark(!dark)}
                  >
                    <div className="flex items-center gap-3">
                      {dark ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      <span>Theme: {dark ? "Dark" : "Light"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <Link
                  href={`/profile/password`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <Settings className="w-4 h-4" />
                  Account settings
                </Link>
              </div>

              {/* Logout Button */}
              <div className="border-t border-border p-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-500 font-medium rounded"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
