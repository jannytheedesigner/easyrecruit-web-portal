"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { Briefcase, Users, FileText, DollarSign, TrendingUp, TrendingDown, ChevronRight, Plus, Search, Calendar, Clock, Award, Target, Zap, Star, CheckCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers"

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Job {
    id: number;
    title: string;
    status: string;
    created_at: string;
    job_type: string;
}

interface Application {
    id: number;
    status: string;
    match_score: number;
    created_at: string;
    job?: Job;
    jobseeker?: {
        user?: User;
    };
}

interface EmployerStats {
    total_jobs: number;
    total_applications: number;
    total_contracts: number;
    total_spent: number;
    recent_jobs?: Job[];
    recent_applications?: Application[];
    applications_chart?: { month: string, count: number }[];
    jobs_chart?: { month: string, count: number }[];
}

const formatMonth = (dtString: string) => {
    if (!dtString) return "";
    const [year, month] = dtString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short' });
};

export default function EmployerDashboardPage() {
    const [stats, setStats] = useState<EmployerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosClient.get("/dashboard/stats/employer");
            setStats(response.data.data || response.data);
        } catch (e) {
            console.error("Failed to fetch employer stats", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    // Process data dynamically from backend stats
    const jobsData = stats?.jobs_chart?.map(item => ({
        month: formatMonth(item.month),
        jobs: item.count
    })) || [];

    const applicationsData = stats?.applications_chart?.map(item => ({
        month: formatMonth(item.month),
        applications: item.count
    })) || [];

    // Derive job statuses distribution
    const statuses = stats?.recent_jobs?.reduce((acc, job) => {
        const s = job.status || 'unknown';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    const rawJobStatusData = [
        { name: "Active", value: statuses['active'] || 0, color: "#0d21a1" },
        { name: "Draft", value: statuses['draft'] || 0, color: "#94a3b8" },
        { name: "Closed", value: statuses['closed'] || 0, color: "#ef4444" },
        { name: "Paused", value: statuses['paused'] || 0, color: "#f59e0b" },
    ].filter(s => s.value > 0);

    const jobStatusData = rawJobStatusData.length > 0 ? rawJobStatusData : [
        { name: "No Data", value: 100, color: "#e2e8f0" }
    ];

    // Derive recent candidates
    const recentCandidates = stats?.recent_applications?.map(app => ({
        id: app.id,
        name: app.jobseeker?.user?.name || "Unknown Candidate",
        role: app.job?.title || "Unknown Role",
        score: app.match_score || 0,
        status: app.status || "Applied"
    })) || [];

    const statCards = [
        {
            title: "Total Postings",
            value: stats?.total_jobs || 0,
            icon: Briefcase,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "Total Applicants",
            value: stats?.total_applications || 0,
            icon: Users,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "Active Contracts",
            value: stats?.total_contracts || 0,
            icon: FileText,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
        {
            title: "Total Spent",
            value: formatCurrency(stats?.total_spent || 0),
            icon: DollarSign,
            color: "bg-er-primary",
            bgColor: "bg-er-primary/5",
        },
    ];

    const quickActions = [
        { title: "Post New Job", icon: Plus, color: "bg-er-primary text-primary-foreground", link: "/employer/jobs/create" },
        { title: "Find Talent", icon: Search, color: "bg-er-complimentary text-white", link: "/employer/search" },
        { title: "Interviews", icon: Calendar, color: "bg-er-secondary-dark text-white", link: "/employer/interviews" },
        { title: "Tutorials", icon: FileText, color: "bg-er-dark text-white", link: "#" },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Immersive Employer Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-slate-900 font-display uppercase tracking-tight">
                        Talent <span className="text-er-primary">Command Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Strategic oversight of your corporate recruitment pipeline.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-slate-200 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px]">
                        <Calendar className="w-4 h-4 mr-2" /> Schedule
                    </Button>
                    <Link href="/employer/jobs/create">
                        <Button className="h-12 bg-slate-900 hover:bg-er-primary text-white rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200">
                            <Plus className="w-4 h-4 mr-2" /> Launch New Role
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                            <div className="relative space-y-4">
                                <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-er-primary/10 group-hover:rotate-6 transition-transform`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</div>
                                    <div className="text-3xl font-bold text-slate-900 font-display">{stat.value}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions Integration */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.title} href={action.link}>
                            <button className="w-full h-20 bg-white rounded-full border border-slate-100 flex items-center gap-4 px-6 group hover:border-er-primary/10 transition-all duration-300">
                                <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{action.title}</span>
                            </button>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Analytics Section */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Postings Velocity</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Growth</p>
                                </div>
                                <Target className="w-5 h-5 text-er-primary" />
                            </div>
                            <div className="h-64">
                                {jobsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={jobsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="jobs" fill="#5662ac" radius={[4, 4, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm font-semibold italic">No data yet</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Applicant Volume</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Candidate Interest</p>
                                </div>
                                <Users className="w-5 h-5 text-er-primary" />
                            </div>
                            <div className="h-64">
                                {applicationsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={applicationsData}>
                                            <defs>
                                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#cf9f0e" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#cf9f0e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="applications" stroke="#cf9f0e" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm font-semibold italic">No flow yet</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Openings Table Polished */}
                    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900 font-display">Active Recruitment</h2>
                                <p className="text-slate-500 font-medium">Real-time status of your strategic job postings.</p>
                            </div>
                            <Link href="/employer/jobs">
                                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest">Manage All</Button>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening Title</th>
                                        <th className="text-left py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="text-left py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                                        <th className="text-right py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Launched At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {stats?.recent_jobs && stats.recent_jobs.length > 0 ? (
                                        stats.recent_jobs.slice(0, 5).map((job) => (
                                            <tr key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5">
                                                    <div className="font-bold text-slate-900 group-hover:text-er-primary transition-colors">{job.title}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{job.job_type ? job.job_type.replace('_', ' ') : 'N/A'}</div>
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${job.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                                        {job.status || 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="py-5">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-lg font-bold text-slate-900">{(job as any).applications_count || 0}</div>
                                                        <div className="text-[8px] text-slate-400 font-bold uppercase">Submitted</div>
                                                    </div>
                                                </td>
                                                <td className="py-5 text-right font-medium text-slate-500 whitespace-nowrap">
                                                    {formatDate(job.created_at)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-slate-400 text-sm font-semibold italic">No recent jobs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column Polished */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Role Status Distribution */}
                    <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Role Distribution</h3>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={jobStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                                        {jobStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-slate-900">{stats?.total_jobs || 0}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Roles</span>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            {jobStatusData.map((status) => (
                                <div key={status.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{status.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">
                                        {stats?.total_jobs ? Math.round((status.value / stats.total_jobs) * 100) : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Applicants */}
                    <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Candidates</h3>
                            <button className="text-[8px] font-bold text-er-primary uppercase tracking-widest underline underline-offset-4">Browse All</button>
                        </div>
                        <div className="space-y-6">
                            {recentCandidates.length > 0 ? (
                                recentCandidates.map((candidate) => (
                                    <div key={candidate.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg group-hover:bg-er-primary transition-colors">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 group-hover:text-er-primary transition-colors w-24 truncate">{candidate.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 truncate">{candidate.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 justify-end text-er-secondary">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-xs font-bold">{Math.round(candidate.score || 0)}</span>
                                            </div>
                                            <div className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-0.5">{candidate.status}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-400 italic text-sm font-semibold">No recent applicants.</div>
                            )}
                        </div>
                    </div>

                    {/* Elite Performance Badge */}
                    <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-400/20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-er-primary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative space-y-6">
                            <div className="w-14 h-14 bg-er-primary rounded-2xl flex items-center justify-center shadow-xl shadow-er-primary/20">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold font-display leading-tight">Elite Employer Score: 87%</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">You are currently in the top tier of hiring activity this quarter.</p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-er-primary">
                                <CheckCircle className="w-4 h-4" /> Strategic Excellence
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}