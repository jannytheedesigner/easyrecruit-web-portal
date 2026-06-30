"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import {
    Users, Briefcase, BadgeDollarSign, ShieldCheck,
    ArrowUpRight, ArrowDownRight, TrendingUp, Activity,
    Globe, Server, ShieldAlert, CheckCircle2
} from "lucide-react"
import { formatCurrency } from "@/lib/helpers"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // In a real app, this would be a single admin/stats endpoint
            // const res = await axiosClient.get("/admin/stats")
            // setStats(res.data)

            // Mocking for now to show the design
            setStats({
                total_users: 1250,
                active_jobs: 48,
                total_revenue: 15400000, // 15.4M MWK
                pending_verifications: 12,
                user_growth: 14.5,
                revenue_growth: 8.2,
                recent_activity: [
                    { id: 1, type: "verification", user: "Zodiak Online", time: "2 mins ago", status: "pending" },
                    { id: 2, type: "job_post", user: "TNM Malawi", time: "15 mins ago", status: "approved" },
                    { id: 3, type: "withdrawal", user: "Alex Phiri", time: "1 hour ago", status: "completed" },
                    { id: 4, type: "dispute", user: "Employer #402", time: "3 hours ago", status: "flagged" },
                ]
            })
        } catch (err) {
            console.error("Failed to fetch admin stats")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    const cards = [
        { label: "Total Platform Users", value: stats.total_users.toLocaleString(), growth: stats.user_growth, icon: Users, color: "bg-blue-500" },
        { label: "Active Marketplace Jobs", value: stats.active_jobs, growth: -2.4, icon: Briefcase, color: "bg-purple-500" },
        { label: "Total Escrow Revenue", value: formatCurrency(stats.total_revenue), growth: stats.revenue_growth, icon: BadgeDollarSign, color: "bg-emerald-500" },
        { label: "Pending Vetting Tasks", value: stats.pending_verifications, growth: 0.5, icon: ShieldCheck, color: "bg-orange-500" },
    ]

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 font-display italic">System <span className="text-er-primary">Overview</span></h1>
                <p className="text-slate-500 font-medium mt-2">Real-time platform metrics and ecosystem health monitoring.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-er-primary transition-all duration-500 group relative overflow-hidden ring-1 ring-slate-100">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 rounded-bl-full transition-transform group-hover:scale-150 duration-700`} />

                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 ${card.color} text-white rounded-2xl shadow-lg ring-4 ring-white`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${card.growth > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                {card.growth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {Math.abs(card.growth)}%
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Mock / System Health */}
                <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
                    </div>

                    <div className="flex items-center justify-between mb-10 relative">
                        <div>
                            <h3 className="text-2xl font-bold font-display italic">Platform <span className="text-er-primary">Vitality</span></h3>
                            <p className="text-slate-400 text-sm font-medium">Network performance and user engagement metrics.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">Healthy</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                <Server className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">99.9% Uptime</span>
                            </div>
                        </div>
                    </div>

                    {/* Mock Graph Area */}
                    <div className="h-64 flex items-end gap-2 relative">
                        {[40, 65, 45, 90, 65, 80, 55, 100, 85, 70, 95, 110].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-er-primary to-blue-400/50 rounded-t-xl group/bar relative transition-all hover:scale-110" style={{ height: `${h}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-slate-900 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap">
                                    {(h * 12.5).toLocaleString()} Vis
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 pr-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden ring-1 ring-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">System <span className="text-er-primary">Logs</span></h3>
                    <div className="space-y-6">
                        {stats.recent_activity.map((act: any) => {
                            const Icon = act.type === "verification" ? ShieldCheck : act.type === "job_post" ? CheckCircle2 : ShieldAlert
                            const colors: any = {
                                pending: "text-amber-500 bg-amber-50",
                                approved: "text-emerald-500 bg-emerald-50",
                                completed: "text-blue-500 bg-blue-50",
                                flagged: "text-rose-500 bg-rose-50"
                            }

                            return (
                                <div key={act.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className={`p-3 rounded-xl ${colors[act.status] || "bg-slate-100 text-slate-500"} transition-transform group-hover:scale-110`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate uppercase tracking-tighter">
                                            {act.type.replace("_", " ")}
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium truncate">{act.user}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{act.time}</span>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${colors[act.status]}`}>{act.status}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <button className="w-full mt-10 py-4 bg-slate-50 text-er-primary text-xs font-bold uppercase tracking-[0.2em] rounded-2xl border border-slate-100 hover:bg-er-primary hover:text-white hover:border-er-primary transition-all shadow-sm">
                        View All Audit Trails
                    </button>
                </div>
            </div>
        </div>
    )
}
