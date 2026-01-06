"use client";

import { useEffect, useState } from "react";
import { FileText, Eye, Trash2, Filter, Search, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatRelativeTime } from "@/lib/helpers";
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
        const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        accepted: applications.filter(a => a.status === "accepted").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "accepted":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                            <p className="text-gray-600 mt-1">Track and manage your job applications</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Total</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-yellow-700 font-medium">Pending</div>
                            <div className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</div>
                        </div>
                        <div className="p-3 bg-yellow-500 text-white rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">Accepted</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">{stats.accepted}</div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-red-700 font-medium">Rejected</div>
                            <div className="text-3xl font-bold text-red-900 mt-1">{stats.rejected}</div>
                        </div>
                        <div className="p-3 bg-red-500 text-white rounded-xl">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search applications by job title..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Applications
                    </button>
                    <button
                        onClick={() => setFilterStatus("pending")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus("accepted")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "accepted" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Accepted
                    </button>
                    <button
                        onClick={() => setFilterStatus("rejected")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "rejected" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Job Title</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Company</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Applied</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{app.job.title}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{app.job.company || "N/A"}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{app.job.location || "N/A"}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{formatRelativeTime(app.created_at)}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/jobseeker/jobs/${app.job.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                {app.status === "pending" && (
                                                    <Button
                                                        onClick={() => deleteApplication(app.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No applications found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        {filterStatus === "all"
                            ? "You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity!"
                            : `No ${filterStatus} applications found. Try adjusting your filters.`}
                    </p>
                    <Link href="/jobseeker/jobs">
                        <Button className="bg-primary text-white">Browse Jobs</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
