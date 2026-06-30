"use client";

import { useEffect, useState } from "react";
import { FileText, Eye, Trash2, Search, CheckCircle, XCircle, Clock, MapPin, Building, Briefcase } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Application {
    id: number;
    job: {
        id: number;
        title: string;
        company?: string;
        location?: string;
    };
    status: string;
    created_at: string;
    updated_at: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axiosClient.get("/proposals");
            setApplications(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id: number) => {
        if (!confirm("Are you sure you want to withdraw this application?")) return;
        try {
            await axiosClient.delete(`/proposals/${id}`);
            setApplications(applications.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete application:", error);
        }
    };

    const filteredApplications = applications.filter((app) => {
        const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesFilter = filterStatus === "all" || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        accepted: applications.filter(a => a.status === "accepted").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "accepted":
                return { badge: "bg-er-complimentary/10 text-er-complimentary border-er-complimentary/20", icon: <CheckCircle className="w-4 h-4" /> };
            case "rejected":
                return { badge: "bg-red-50 text-red-600 border-red-100", icon: <XCircle className="w-4 h-4" /> };
            case "pending":
                return { badge: "bg-er-secondary/10 text-er-secondary-dark border-er-secondary/20", icon: <Clock className="w-4 h-4" /> };
            default:
                return { badge: "bg-cyan-500 text-white border-cyan-500", icon: <FileText className="w-4 h-4" /> };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10 container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">
                        My Applications
                    </h1>
                    <p className="text-slate-500 font-medium">Track your job applications and opportunities.</p>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-er-primary/10 rounded-full flex items-center justify-center text-er-primary">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Total Sent</div>
                            <div className="text-3xl font-bold text-slate-900 font-display">{stats.total}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-er-secondary/10 rounded-full flex items-center justify-center text-er-secondary-dark">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Pending</div>
                            <div className="text-3xl font-bold text-slate-900 font-display">{stats.pending}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-er-complimentary/10 rounded-full flex items-center justify-center text-er-complimentary">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Accepted</div>
                            <div className="text-3xl font-bold text-slate-900 font-display">{stats.accepted}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <XCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Rejected</div>
                            <div className="text-3xl font-bold text-slate-900 font-display">{stats.rejected}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white rounded-full p-4 md:p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="w-full md:flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search your applications..."
                            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-er-primary/20 focus:border-er-primary text-sm font-medium text-slate-700 bg-slate-50 transition-all"
                        />
                    </div>

                    <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
                        {["all", "pending", "accepted", "rejected"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${filterStatus === status
                                        ? status === "accepted" ? "bg-er-complimentary text-white shadow-lg shadow-er-complimentary/30"
                                            : status === "rejected" ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                                : status === "pending" ? "bg-er-secondary text-er-dark shadow-lg shadow-er-secondary/30"
                                                    : "bg-er-primary text-white shadow-lg shadow-er-primary/30"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Applications Cards Layout */}
            {filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => {
                        const style = getStatusStyle(app.status);
                        return (
                            <div key={app.id} className="bg-white p-6 rounded-3xl transition-all duration-500 group flex flex-col justify-between h-full relative overflow-hidden">
                                {/* Decorative Accent */}
                                {app.status === "accepted" && <div className="absolute top-0 right-0 w-24 h-24 bg-er-complimentary/5 rounded-bl-[100%] transition-transform group-hover:scale-125 pointer-events-none" />}
                                {app.status === "pending" && <div className="absolute top-0 right-0 w-24 h-24 bg-er-secondary/5 rounded-bl-[100%] transition-transform group-hover:scale-125 pointer-events-none" />}

                                <div>
                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-er-primary/10 group-hover:text-er-primary transition-colors border border-slate-100">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border-1 uppercase tracking-wider flex items-center gap-1.5 ${style.badge}`}>

                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="space-y-1 mb-6 relative z-10">
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-er-primary transition-colors line-clamp-1 font-display">
                                            {app.job?.title || "Unknown Position"}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Building className="w-3.5 h-3.5" />
                                            {app.job?.company || "Confidential Company"}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                                            <MapPin className="w-3 h-3" /> {app.job?.location || "Remote"}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                                            <Clock className="w-3 h-3" /> {formatRelativeTime(app.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 relative z-10">
                                    <Link href={`/jobseeker/jobs/${app.job?.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-full text-sm font-bold py-4 bg-er-primary text-white hover:bg-er-primary hover:text-white">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Job
                                        </Button>
                                    </Link>
                                    {app.status === "pending" && (
                                        <Button
                                            onClick={() => deleteApplication(app.id)}
                                            variant="outline"
                                            className="w-11 h-11 p-0 rounded-xl border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
                                            title="Withdraw Application"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-3xl p-16 border border-slate-100 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/40">
                        <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">No applications found</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                        {filterStatus === "all"
                            ? "Your application pipeline is currently empty. Start exploring our job market to find your next strategic role."
                            : `You don't have any ${filterStatus} applications. Adjust your filters or browse more jobs.`}
                    </p>
                    <Link href="/jobseeker/jobs">
                        <Button className="bg-er-primary hover:bg-er-primary-dark text-white rounded-full h-12 px-8 font-bold uppercase tracking-widest text-xs">
                            Explore Market
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
