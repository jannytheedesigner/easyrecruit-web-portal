"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import {
    ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
    Eye, MoreVertical, Search, Filter, Briefcase,
    Building2, Flag, FileWarning, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/helpers"

export default function AdminModerationPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            // Mocking job moderation queue
            setJobs([
                { id: 101, title: "Senior Fullstack Engineer", employer: "TNM Malawi", budget: "2,500,000", status: "pending", flags: 0, date: "2024-03-30" },
                { id: 102, title: "Crypto Trader Manager", employer: "Global Wealth", budget: "5,000,000", status: "flagged", flags: 12, date: "2024-03-29" },
                { id: 103, title: "Data Analyst", employer: "NICO Life", budget: "1,200,000", status: "active", flags: 0, date: "2024-03-28" },
                { id: 104, title: "Operations Lead", employer: "Airtel Malawi", budget: "3,000,000", status: "pending", flags: 1, date: "2024-03-27" },
            ])
        } catch (err) {
            console.error("Failed to fetch jobs for moderation")
        } finally {
            setLoading(false)
        }
    }

    const handleModeration = async (id: number, action: "approve" | "reject" | "flag") => {
        try {
            // await axiosClient.post(`/admin/jobs/${id}/moderate`, { action })
            setJobs(jobs.map(j => j.id === id ? { ...j, status: action === "approve" ? "active" : action === "reject" ? "closed" : "flagged" } : j))
            toast({ title: "Updated", description: `Job post has been ${action}ed.` })
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Moderation failed." })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 font-display italic">Job <span className="text-er-primary">Moderation</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Audit job listings for compliance, quality, and community safety.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-er-primary outline-none text-sm w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Moderation Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center gap-4">
                    <div className="p-4 bg-amber-500 text-white rounded-2xl">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Flagged Content</p>
                        <h4 className="text-2xl font-bold text-slate-900">12 Posts</h4>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4">
                    <div className="p-4 bg-blue-500 text-white rounded-2xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Pending Review</p>
                        <h4 className="text-2xl font-bold text-slate-900">8 Posts</h4>
                    </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Approved Today</p>
                        <h4 className="text-2xl font-bold text-slate-900">24 Posts</h4>
                    </div>
                </div>
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-[10px] font-bold text-slate-400 tracking-[0.2em]">
                                <th className="px-8 py-5">Job Details</th>
                                <th className="px-8 py-5">Budget</th>
                                <th className="px-8 py-5">Flags</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-200 group-hover:scale-110 transition-transform shadow-sm overflow-hidden ring-4 ring-slate-50">
                                                <Briefcase className="w-5 h-5 text-er-primary" />
                                            </div>
                                            <div className="min-w-0 pr-4">
                                                <h4 className="font-bold text-slate-900 truncate uppercase mt-1 tracking-tighter">{job.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
                                                    <Building2 className="w-3 h-3 text-slate-400" /> {job.employer}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-900">
                                            MWK {job.budget}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{job.date}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        {job.flags > 0 ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-[10px] font-bold uppercase tracking-tighter shadow-sm w-fit animate-pulse">
                                                <FileWarning className="w-3.5 h-3.5" />
                                                {job.flags} Reports
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Flags</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border tracking-widest ${job.status === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100 ring-2 ring-blue-500/10' :
                                                job.status === 'flagged' ? 'bg-amber-50 text-amber-600 border-amber-100 ring-2 ring-amber-500/10' :
                                                    job.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-2 ring-emerald-500/10' :
                                                        'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold">
                                                <Eye className="w-4 h-4 mr-2" /> Inspect
                                            </Button>

                                            {job.status === 'pending' || job.status === 'flagged' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleModeration(job.id, "approve")}
                                                        className="w-10 h-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleModeration(job.id, "reject")}
                                                        className="w-10 h-10 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center hover:bg-rose-600 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleModeration(job.id, "flag")}
                                                    className="w-10 h-10 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center hover:bg-amber-600 transition-all hover:scale-110 active:scale-95"
                                                >
                                                    <Flag className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex items-center gap-4 py-4 px-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                        <AlertTriangle className="w-5 h-5 text-er-primary shrink-0" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            Moderators must review the "Flagged Content" within 24 hours. Failure to act on high-flag counts leads to automatic suspension of the employer account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
