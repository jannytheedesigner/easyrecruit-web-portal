"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import {
    UserCheck, ShieldCheck, XCircle, Eye,
    FileText, CheckCircle2, AlertTriangle,
    MoreVertical, Search, Filter, Mail, Phone,
    Building2, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function AdminVerificationsPage() {
    const [verifications, setVerifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        fetchVerifications()
    }, [])

    const fetchVerifications = async () => {
        try {
            // Mocking verification requests
            setVerifications([
                { id: 1, type: "employer", name: "Sunbird Hotels", email: "hr@sunbird.mw", status: "pending", docs: 3, date: "2024-03-28" },
                { id: 2, type: "jobseeker", name: "Kelvin Phiri", email: "kelvin@phiri.me", status: "pending", docs: 5, date: "2024-03-29" },
                { id: 3, type: "employer", name: "Press Corp", email: "admin@presscorp.mw", status: "approved", docs: 4, date: "2024-03-25" },
                { id: 4, type: "employer", name: "Generic Bank", email: "hr@generic.mw", status: "rejected", docs: 2, date: "2024-03-20" },
            ])
        } catch (err) {
            console.error("Failed to fetch verifications")
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id: number, status: "approved" | "rejected") => {
        try {
            // await axiosClient.post(`/admin/verifications/${id}/${status}`)
            setVerifications(verifications.map(v => v.id === id ? { ...v, status } : v))
            toast({ title: `Success!`, description: `Record has been ${status}.` })
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update record." })
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
                    <h1 className="text-4xl font-bold text-slate-900 font-display italic">Vetting <span className="text-er-primary">Queue</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Approve or reject KYC documents for Employers and JobSeekers.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find application..."
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-er-primary outline-none text-sm w-64 shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-slate-200">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>
            </div>

            {/* Verification Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-[10px] font-bold text-slate-400 tracking-[0.2em]">
                                <th className="px-8 py-5">Entity Details</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Documents</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Applied</th>
                                <th className="px-8 py-5 text-right">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {verifications.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200 group-hover:scale-110 transition-transform shadow-sm">
                                                {v.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 truncate uppercase mt-1 tracking-tighter">{v.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
                                                    <Mail className="w-3 h-3" /> {v.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {v.type === "employer" ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                                                    <Building2 className="w-3.5 h-3.5" /> Employer
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                                                    <UserCheck className="w-3.5 h-3.5" /> JobSeeker
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            {v.docs} Files
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border tracking-widest ${v.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 ring-2 ring-amber-500/10' :
                                                v.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-2 ring-emerald-500/10' :
                                                    'bg-rose-50 text-rose-600 border-rose-100 ring-2 ring-rose-500/10'
                                            }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            {v.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold">
                                                <Eye className="w-4 h-4 mr-2" /> Inspect
                                            </Button>
                                            {v.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(v.id, "approved")}
                                                        className="w-10 h-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(v.id, "rejected")}
                                                        className="w-10 h-10 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center hover:bg-rose-600 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Showing 4 of 12 Pending Reviews</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="rounded-xl px-6 opacity-30">Previous</Button>
                        <Button variant="outline" size="sm" className="rounded-xl px-6 font-bold border-er-primary text-er-primary hover:bg-er-primary hover:text-white transition-all">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
