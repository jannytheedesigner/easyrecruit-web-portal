"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import type { Job } from "@/types/job";
import { Search, Filter, MapPin, DollarSign, Briefcase, Clock, Building, Bookmark, TrendingUp, Star, Heart } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

export default function JobseekerJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
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

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || job.job_category?.name === filterCategory;
        const matchesType = filterType === "all" || job.job_type === filterType;
        return matchesSearch && matchesCategory && matchesType && job.status === "active";
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                            <p className="text-gray-600 mt-1">Find your next opportunity</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Available Jobs</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-600">Active opportunities</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">New This Week</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">{stats.new}</div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600">Fresh opportunities</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-purple-700 font-medium">Saved Jobs</div>
                            <div className="text-3xl font-bold text-purple-900 mt-1">{stats.saved}</div>
                        </div>
                        <div className="p-3 bg-purple-500 text-white rounded-xl">
                            <Bookmark className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-purple-600">Your bookmarks</div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search jobs by title or description..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
                        >
                            <option value="all">All Types</option>
                            {jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        onClick={() => { setFilterCategory("all"); setFilterType("all"); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterCategory === "all" && filterType === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Jobs
                    </button>
                    <button
                        onClick={() => setFilterType("full-time")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === "full-time" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Full-Time
                    </button>
                    <button
                        onClick={() => setFilterType("part-time")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === "part-time" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Part-Time
                    </button>
                    <button
                        onClick={() => setFilterType("contract")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === "contract" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Contract
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => {
                    const isSaved = savedJobs.includes(job.id);
                    return (
                        <div
                            key={job.id}
                            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300"
                        >
                            {/* Job Header */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleSaveJob(job.id)}
                                        className={`p-2 rounded-lg transition-colors ${isSaved ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-100"}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                                    </button>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building className="w-4 h-4" />
                                        <span>{job.job_category?.name || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{job.job_type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4" />
                                        <span>
                                            {job.budget_min && job.budget_max
                                                ? `${formatCurrency(Number(job.budget_min))} - ${formatCurrency(Number(job.budget_max))}`
                                                : "Salary not specified"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{formatRelativeTime(job.created_at)}</span>
                                    </div>
                                    <Link href={`/jobseeker/jobs/${job.id}`}>
                                        <Button size="sm" className="bg-primary text-white hover:bg-blue-700">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredJobs.length === 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
                    </p>
                    <button
                        onClick={() => { setSearchTerm(""); setFilterCategory("all"); setFilterType("all"); }}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
