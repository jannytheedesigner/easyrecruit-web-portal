"use client"

import { ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/Loader"
import { ShieldCheck, LayoutDashboard, UserCheck, ShieldAlert, BadgeDollarSign, Settings, Bell, LogOut, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Loader size="lg" />
            </div>
        )
    }

    if (!user || user.role !== "admin") {
        router.push("/auth/login")
        return null
    }

    const menuItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/verifications", label: "Verifications", icon: UserCheck },
        { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
        { href: "/admin/financials", label: "Financials", icon: BadgeDollarSign },
    ]

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-er-primary rounded-xl shadow-lg shadow-er-primary/40 text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight font-display italic">Admin<span className="text-er-primary">Panel</span></h2>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const active = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${active
                                        ? "bg-er-primary text-white shadow-xl shadow-er-primary/20 scale-[1.02]"
                                        : "hover:bg-white/10 hover:text-white"}`}
                                >
                                    <item.icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-slate-800 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                            A
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">System Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-er-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system records..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-er-primary/20 focus:bg-white transition-all outline-none text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-2xl hover:bg-slate-100 flex items-center justify-center relative transition-colors text-slate-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                        </button>
                        <button className="w-12 h-12 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
