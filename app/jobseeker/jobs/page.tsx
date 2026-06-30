"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import type { Job } from "@/types/job";
import { Search, Filter, MapPin, DollarSign, Briefcase, Clock, Building, Bookmark, TrendingUp, Heart, ExternalLink, ShieldCheck, UsersIcon, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

export default function JobseekerJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterSource, setFilterSource] = useState<"all" | "internal" | "external">("all");
    const [savedJobs, setSavedJobs] = useState<number[]>([]);

    useEffect(() => {
        fetchJobs();
        loadSavedJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axiosClient.get("/jobs");
            setJobs(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedJobs = () => {
        const saved = JSON.parse(localStorage.getItem("saved_job_ids") || "[]");
        setSavedJobs(saved);
    };

    const toggleSaveJob = (jobId: number) => {
        const newSaved = savedJobs.includes(jobId)
            ? savedJobs.filter(id => id !== jobId)
            : [...savedJobs, jobId];
        setSavedJobs(newSaved);
        localStorage.setItem("saved_job_ids", JSON.stringify(newSaved));
    };

    const trackExternalClick = async (jobId: number, url: string) => {
        try {
            await axiosClient.post(`/jobs/${jobId}/track-click`);
        } catch (err) {
            console.warn("Tracking failed, but continuing redirect...");
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || job.job_category?.name === filterCategory;
        const matchesType = filterType === "all" || job.job_type === filterType;
        const matchesSource = filterSource === "all" || job.source === filterSource;
        return matchesSearch && matchesCategory && matchesType && matchesSource && job.status === "active";
    });

    const categories = Array.from(new Set(jobs.map(j => j.job_category?.name).filter(Boolean)));
    const jobTypes = Array.from(new Set(jobs.map(j => j.job_type).filter(Boolean)));

    const stats = {
        total: filteredJobs.length,
        new: filteredJobs.filter(j => {
            const createdDate = new Date(j.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate > weekAgo;
        }).length,
        saved: savedJobs.length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 container mx-auto px-4">
            {/* Immersive Market Header */}
            <div className="bg-er-primary rounded-4xl p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-96 h-96 bg-er-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-3 w-fit rounded-full py-2 px-4 border-2 border-er-secondary">
                            <span className="text-sm font-semibold text-white">Global Job Market</span>
                        </div>
                        <h1 className="text-5xl font-bold font-display leading-tighter mb-4 tracking-tight">Discover Your Next <span className="text-er-secondary">Masterpiece</span> Role.</h1>
                        <p className="text-white text-lg font-medium leading-tight">Explore verified internal opportunities and strategic external listings curated for your professional profile.</p>
                    </div>

                </div>
            </div>

            {/* Strategic Filters Bar */}
            <div className="sticky top-24 z-40">
                <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-full p-4 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full lg:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Create search for titles, skills, or roles..."
                            className="w-full pl-14 pr-6 py-3 bg-slate-50 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-er-primary/20 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto px-2">
                        {["all", "internal", "external"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterSource(s as any)}
                                className={`px-6 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterSource === s ? "bg-er-dark text-white" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                            >
                                {s} Listings
                            </button>
                        ))}
                        <div className="w-[1px] h-8 bg-slate-100 mx-2 flex-shrink-0" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-6 py-4 bg-white border border-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-er-primary/20 outline-none cursor-pointer"
                        >
                            <option value="all">Domain</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Professional Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredJobs.map((job) => {
                    const isSaved = savedJobs.includes(job.id);
                    const isExternal = job.source === "external";

                    return (
                        <div
                            key={job.id}
                            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:border-er-primary/20 transition-all duration-500 flex flex-col"
                        >
                            <div className="p-8 space-y-6 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            {isExternal ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-orange-600">
                                                    <ExternalLink className="w-3 h-3" /> External Market
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-er-primary/5 border border-er-primary/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-er-primary">
                                                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                                                </span>
                                            )}
                                            {job.match_score !== undefined && (
                                                <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-[9px] font-bold uppercase tracking-widest ${job.match_score > 80 ? "bg-green-50 border-green-100 text-green-600 shadow-sm shadow-green-100" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
                                                    <Sparkles className="w-3 h-3" /> {job.match_score}% High Match
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-er-primary transition-colors line-clamp-2">
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
                                                    <Building className="w-3 h-3 text-slate-400" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.employer?.company_name || job.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSaveJob(job.id)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSaved ? "bg-red-50 text-red-500 shadow-inner" : "bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500"}`}
                                    >
                                        <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Location Mode</div>
                                        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-er-primary" /> {job.location || job.employer?.district || "Remote"}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Contract Basis</div>
                                        <div className="text-xs font-bold text-slate-700 flex items-center gap-2 text-capitalize">
                                            <Briefcase className="w-3 h-3 text-er-primary" /> {job.job_type?.replace("_", " ")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Budget Allocation</div>
                                        <div className="text-lg font-bold text-slate-900 group-hover:text-er-primary transition-colors">
                                            {job.budget_min ? formatCurrency(Number(job.budget_min)) : "Negotiable"}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Applicants</div>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-900">{job.applications?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-0">
                                {isExternal ? (
                                    <Button
                                        onClick={() => trackExternalClick(job.id, job.external_link || "#")}
                                        className="w-full h-16 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all group-hover:shadow-xl shadow-orange-100"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" /> Navigate To Partner
                                    </Button>
                                ) : (
                                    <Link href={`/jobseeker/jobs/${job.id}`}>
                                        <Button className="w-full h-16 bg-slate-900 hover:bg-er-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 group-hover:shadow-er-primary/20 transition-all">
                                            Deep Analyze Role <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredJobs.length === 0 && (
                <div className="bg-white rounded-[4rem] p-24 border border-slate-100 text-center shadow-2xl shadow-slate-100/50">
                    <div className="w-32 h-32 mx-auto mb-10 bg-slate-50 rounded-[2.5rem] flex items-center justify-center group">
                        <Search className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-900 font-display mb-4">No Strategic Matches</h3>
                    <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                        Our algorithm couldn't find active roles for these parameters. Try broadening your criteria or reset filters.
                    </p>
                    <Button
                        onClick={() => { setSearchTerm(""); setFilterCategory("all"); setFilterType("all"); setFilterSource("all"); }}
                        className="h-16 px-12 bg-er-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-er-primary/20 hover:scale-105 transition-transform"
                    >
                        Reset All Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
