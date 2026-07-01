// components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Bell, Moon, Sun, Search, ChevronDown, Settings, LogOut, Menu, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (user) {
      axiosClient.get("/wallet/balance")
        .then((res) => {
          setBalance(res.data.data?.balance || 0)
        })
        .catch(() => setBalance(0))
    }
  }, [user])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const target = `${basePath}/jobs?search=${encodeURIComponent(query.trim())}`
    router.push(target)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={homeHref} className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm">
            <Logo
              brandName="easyrecruit"
              type="horizontal"
              variant="secondary"
              format="svg"
              width={140}
              height={34}
              alt="EasyRecruit Logo"
              className="flex w-[7em]"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1">
            {navLinks.map((l) => {
              const active = pathname?.startsWith(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`er-nav-pill ${active ? "active" : "text-slate-600 hover:bg-white hover:text-er-primary"}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end xl:flex">
          <form onSubmit={onSearch} className="flex w-full max-w-xl items-center gap-2">
            <div className="flex h-11 w-full items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-4 shadow-sm">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`${basePath}/notifications`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md xl:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Profile menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-er-primary to-er-primary-dark font-bold text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_24px_55px_-24px_rgba(13,33,161,0.35)] z-50">
                <div className="flex items-center gap-3 border-b border-slate-200 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-er-primary to-er-primary-dark text-lg font-bold text-white">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{user?.name || "User"}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-xs text-slate-500">Online for messages</p>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-2">
                  <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-400"></div>
                    Your profile
                  </Link>

                  <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Stats and trends
                  </Link>

                  <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account health
                  </Link>

                  <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Membership plan
                  </Link>

                  <div className="px-4 py-2.5 transition hover:bg-slate-50">
                    <button className="flex w-full items-center justify-between text-sm text-slate-700" onClick={() => setDark(!dark)}>
                      <div className="flex items-center gap-3">
                        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        <span>Theme: {dark ? "Dark" : "Light"}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <Link href="/profile/password" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                    <Settings className="h-4 w-4" />
                    Account settings
                  </Link>
                </div>

                <div className="border-t border-slate-200 p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg xl:hidden">
          <form onSubmit={onSearch} className="mb-4">
            <div className="flex h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-4 shadow-sm">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            {navLinks.map((l) => {
              const active = pathname?.startsWith(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-2xl px-3 py-3 text-sm font-medium ${active ? "bg-er-primary/10 text-er-primary" : "bg-white text-slate-700 shadow-sm"}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
