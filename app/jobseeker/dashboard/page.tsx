"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Briefcase, CheckCircle2, FileCheck, Sparkles, TrendingUp, Users, DollarSign, Clock, Target, Award, Search, FileText, Bell, Eye, MapPin, Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers";

interface Proposal {
    id: number;
    status: string;
    created_at: string;
    job?: { id: number; title: string; company?: string };
}

interface JobItem {
    id: number;
    title: string;
    company?: string;
    location?: string;
    job_type?: string;
    budget_min?: string;
    budget_max?: string;
}

interface JobseekerStats {
    total_applications: number;
    pending_applications: number;
    active_interviews: number;
    matches: number;
    profile_progress: number;
}

export default function JobseekerDashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<JobseekerStats | null>(null);
    const [applications, setApplications] = useState<Proposal[]>([]);
    const [recommended, setRecommended] = useState<JobItem[]>([]);
    const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, appsRes, jobsRes] = await Promise.all([
                axiosClient.get("/dashboard/stats/jobseeker"),
                axiosClient.get("/proposals"),
                axiosClient.get("/jobs"),
            ]);

            setStats(statsRes.data.data || statsRes.data);
            setApplications(appsRes.data?.data || appsRes.data || []);
            setRecommended((jobsRes.data?.data || jobsRes.data || []).slice(0, 6));

            const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
            setSavedJobs(saved);
        } catch (e) {
            console.warn("Failed to load some dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    const appCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const a of applications) counts[a.status] = (counts[a.status] || 0) + 1;
        return counts;
    }, [applications]);

    // Mock data for charts
    const applicationsData = [
        { month: "Jan", applications: 3 },
        { month: "Feb", applications: 5 },
        { month: "Mar", applications: 4 },
        { month: "Apr", applications: 8 },
        { month: "May", applications: 6 },
        { month: "Jun", applications: applications.length },
    ];

    const profileViewsData = [
        { month: "Jan", views: 45 },
        { month: "Feb", views: 52 },
        { month: "Mar", views: 61 },
        { month: "Apr", views: 58 },
        { month: "May", views: 70 },
        { month: "Jun", views: 85 },
    ];

    const applicationStatusData = [
        { name: "Pending", value: appCounts.pending || 0, color: "#f59e0b" },
        { name: "Accepted", value: appCounts.accepted || 0, color: "#10b981" },
        { name: "Rejected", value: appCounts.rejected || 0, color: "#ef4444" },
    ];

    const quickActions = [
        { title: "Complete Profile", icon: FileCheck, color: "bg-er-primary text-primary-foreground", href: "/jobseeker/profile" },
        { title: "Search Jobs", icon: Search, color: "bg-er-complimentary text-white", href: "/jobseeker/jobs" },
        { title: "My Applications", icon: FileText, color: "bg-er-secondary-dark text-white", href: "/jobseeker/applications" },
        { title: "Notifications", icon: Bell, color: "bg-er-dark text-white", href: "/jobseeker/notifications" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Applications",
            value: stats?.total_applications || 0,
            icon: Briefcase,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "Active Interviews",
            value: stats?.active_interviews || 0,
            icon: Eye,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "AI Matches",
            value: stats?.matches || 0,
            icon: Bookmark,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "Profile Score",
            value: `${stats?.profile_progress || 0}%`,
            icon: Award,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
    ];

    return (
        <div className="space-y-8 pb-10 container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Welcome Message */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-slate-900 font-display">
                        Welcome, <span className="text-er-primary">{user?.name?.split(' ')[0] || "Associate"}</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Here's an overview of your professional search progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-er-complimentary px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        <span className="text-sm font-medium text-white">Profile Active</span>
                    </div>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                            <div className="relative space-y-2">
                                <div className={`w-14 h-14 text-er-primary`}>
                                    <Icon className="w-10 h-10 stroke-[1.3px]" />
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-slate-400 tracking mb-1">{stat.title}</div>
                                    <div className="text-3xl font-bold text-slate-900 font-display">{stat.value}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.title} href={action.href}>
                            <button className="w-full h-20 bg-white rounded-full border border-slate-100 flex items-center gap-4 px-6 group hover:border-er-primary/10 transition-all duration-300">
                                <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-base font-medium text-slate-700 tracking-tight">{action.title}</span>
                            </button>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Search Velocity</h3>
                                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">Monthly Applications</p>
                                </div>
                                <Target className="w-8 h-8 stroke-[1.5px] text-er-primary" />
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={applicationsData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="applications" fill="#5662ac" radius={[4, 4, 0, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Market Interest</h3>
                                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">Profile Views</p>
                                </div>
                                <Eye className="w-8 h-8 stroke-[1.5px] text-er-secondary" />
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profileViewsData}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#cf9f0e" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#cf9f0e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="views" stroke="#cf9f0e" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Content */}
                    <div className="bg-white p-10 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900 font-display">Recommended For You</h2>
                                <p className="text-slate-500 font-medium">Strategic opportunities matching your verified skills.</p>
                            </div>
                            <Link href="/jobseeker/jobs">
                                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest">View Market</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommended.slice(0, 4).map((job) => (
                                <div key={job.id} className="p-6 rounded-3xl border border-slate-100 hover:border-er-primary hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-er-primary/10 group-hover:text-er-primary transition-colors">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-er-primary transition-colors line-clamp-1">{job.title}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{job.company || "Corporate Partner"}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500">
                                                <MapPin className="w-3 h-3" /> {job.location || "Remote"}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-er-primary/5 rounded-full text-[10px] font-bold text-er-primary uppercase">
                                                <Users className="w-3 h-3" /> {(job as any).applications?.length || 0} Applicants
                                            </span>
                                        </div>
                                    </div>
                                    <Link href={`/jobseeker/jobs/${job.id}`} className="mt-6">
                                        <Button className="w-full bg-slate-900 hover:bg-er-primary text-white rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">Analyze Opportunity</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-10">
                    {/* CV Builder Standalone Promo */}
                    <div className="bg-er-primary rounded-3xl p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-400/20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-er-primary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative space-y-6">
                            <div className="w-14 h-14 bg-er-primary rounded-2xl flex items-center justify-center shadow-xl shadow-er-primary/20">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold font-display leading-tighter">EasyCV Pro: Create Mode</h3>
                                <p className="text-sm text-slate-100 font-medium leading-tight">Redesign your professional document using our standalone builder.</p>
                            </div>
                            <Link href="/jobseeker/cvs/create" className="block">
                                <Button className="w-full h-14 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs">Start Createing</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Application Stats Wheel */}
                    <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Pipeline Efficiency</h3>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={applicationStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                                        {applicationStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-slate-900">{stats?.total_applications || 0}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Apps</span>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            {applicationStatusData.map((status) => (
                                <div key={status.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{status.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{status.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Feed */}
                    <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Application Feed</h3>
                            <Link href="/jobseeker/applications" className="text-[8px] font-bold text-er-primary uppercase tracking-widest underline underline-offset-4">History</Link>
                        </div>
                        <div className="space-y-6">
                            {applications.slice(0, 3).map((app) => (
                                <div key={app.id} className="relative pl-6 border-l-2 border-slate-100 group">
                                    <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-slate-200 group-hover:bg-er-primary transition-colors" />
                                    <div className="text-sm font-bold text-slate-900 leading-tight group-hover:text-er-primary transition-colors">{app.job?.title || "Project Alpha"}</div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.status.replace(/_/g, ' ')}</span>
                                        <span className="text-[10px] text-slate-300 font-bold">{formatRelativeTime(app.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
