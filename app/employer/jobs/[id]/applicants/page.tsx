"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import type { Application, ApplicationFilter } from "@/types/application";
import type { Job } from "@/types/job";
import {
    ArrowLeft,
    Search,
    Filter,
    Star,
    Sparkles,
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

const STATUS_OPTIONS = [
    { value: "applied", label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "viewed", label: "Viewed", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { value: "shortlisted", label: "Shortlisted", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { value: "assessed", label: "Assessed", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { value: "interview", label: "Interview", color: "bg-pink-50 text-pink-700 border-pink-200" },
    { value: "hired", label: "Hired", color: "bg-green-50 text-green-700 border-green-200" },
    { value: "rejected", label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
];

const MATCH_LEVEL_OPTIONS = [
    { value: "excellent", label: "Excellent Match (80+)", score: 80 },
    { value: "good", label: "Good Match (50-79)", score: 50 },
    { value: "average", label: "Average Match (0-49)", score: 0 },
];

export default function JobApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<ApplicationFilter>({});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobRes, applicationsRes] = await Promise.all([
                axiosClient.get(`/jobs/${params.id}`),
                axiosClient.get(`/employer/jobs/${params.id}/applications`, {
                    params: {
                        ...filters,
                        search: searchTerm,
                    },
                }),
            ]);

            setJob(jobRes.data?.data || jobRes.data);
            setApplications(applicationsRes.data?.data || applicationsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (score: number) => {
        if (score >= 80) return "bg-green-100 text-green-700";
        if (score >= 50) return "bg-blue-100 text-blue-700";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "applied":
                return <Clock className="w-4 h-4" />;
            case "viewed":
                return <CheckCircle className="w-4 h-4" />;
            case "hired":
                return <Star className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return <ChevronDown className="w-4 h-4" />;
        }
    };

    const filteredApplications = applications.filter((app) => {
        if (
            searchTerm &&
            !app.jobseeker?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !app.jobseeker?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const highlightedApps = filteredApplications.filter((app) => app.is_highlighted);
    const otherApps = filteredApplications.filter((app) => !app.is_highlighted);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/employer/jobs/${params.id}`}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {applications.length} {applications.length === 1 ? "application" : "applications"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">Filters</span>
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Status
                                </label>
                                <select
                                    value={filters.status || ""}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            status: e.target.value ? (e.target.value as any) : undefined,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Match Level
                                </label>
                                <select
                                    value={filters.match_level || ""}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            match_level: e.target.value ? (e.target.value as any) : undefined,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">All Matches</option>
                                    {MATCH_LEVEL_OPTIONS.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Min Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={filters.min_score || ""}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            min_score: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Applications List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            {searchTerm || Object.keys(filters).length > 0
                                ? "No applications found matching your criteria"
                                : "No applications yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Top Applicants */}
                        {highlightedApps.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Top Applicants
                                    </h2>
                                    <span className="text-sm text-gray-500">
                                        ({highlightedApps.length})
                                    </span>
                                </div>
                                <div className="grid gap-3">
                                    {highlightedApps.map((app) => (
                                        <ApplicationCard
                                            key={app.id}
                                            app={app}
                                            getMatchColor={getMatchColor}
                                            getStatusIcon={getStatusIcon}
                                            params={params}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Applicants */}
                        {otherApps.length > 0 && (
                            <div className="space-y-2">
                                {highlightedApps.length > 0 && (
                                    <div className="flex items-center gap-2 mb-4 pt-6 border-t border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            All Applicants
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            ({otherApps.length})
                                        </span>
                                    </div>
                                )}
                                <div className="grid gap-3">
                                    {otherApps.map((app) => (
                                        <ApplicationCard
                                            key={app.id}
                                            app={app}
                                            getMatchColor={getMatchColor}
                                            getStatusIcon={getStatusIcon}
                                            params={params}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ApplicationCard({
    app,
    getMatchColor,
    getStatusIcon,
    params,
}: {
    app: Application;
    getMatchColor: (score: number) => string;
    getStatusIcon: (status: string) => React.ReactNode;
    params: any;
}) {
    const statusOption = STATUS_OPTIONS.find((s) => s.value === app.status);

    return (
        <Link href={`/employer/jobs/${params.id}/applicants/${app.id}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            {app.is_highlighted && (
                                <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            )}
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                {app.jobseeker?.name || "Unknown"}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-500 truncate mb-3">
                            {app.jobseeker?.email}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${statusOption?.color}`}
                            >
                                {getStatusIcon(app.status)}
                                {statusOption?.label}
                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchColor(
                                    app.match_score
                                )}`}
                            >
                                {app.match_score}% Match
                            </span>

                            <span className="text-xs text-gray-500">
                                {formatDate(app.created_at)}
                            </span>
                        </div>

                        {app.jobseeker?.title && (
                            <p className="text-sm text-gray-600 mt-2">
                                {app.jobseeker.title}
                                {app.jobseeker.years_of_experience && (
                                    <span> • {app.jobseeker.years_of_experience} years exp.</span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                                {app.match_label}
                            </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
