"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, FileQuestion, CheckCircle, Clock, Users, TrendingUp } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Assessment {
    id: number;
    title: string;
    description: string;
    type: "quiz" | "assignment" | "test";
    duration: number;
    questions_count: number;
    status: "draft" | "published" | "archived";
    created_at: string;
    updated_at: string;
}

export default function AssessmentsPage() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await axiosClient.get("/assessments");
            setAssessments(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAssessment = async (id: number) => {
        if (!confirm("Are you sure you want to delete this assessment?")) return;
        try {
            await axiosClient.delete(`/assessments/${id}`);
            setAssessments(assessments.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete assessment:", error);
        }
    };

    const filteredAssessments = assessments.filter((assessment) => {
        const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assessment.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || assessment.type === filterType;
        const matchesStatus = filterStatus === "all" || assessment.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: assessments.length,
        published: assessments.filter(a => a.status === "published").length,
        draft: assessments.filter(a => a.status === "draft").length,
        archived: assessments.filter(a => a.status === "archived").length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-700 border-green-200";
            case "draft":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "archived":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "quiz":
                return "bg-blue-100 text-blue-700";
            case "assignment":
                return "bg-purple-100 text-purple-700";
            case "test":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                            <FileQuestion className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
                            <p className="text-gray-600 mt-1">Create and manage quizzes and assessments for candidates</p>
                        </div>
                    </div>
                </div>
                <Link href="/employer/assessments/create">
                    <Button className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                        <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
                            <Plus className="w-4 h-4" />
                        </div>
                        Create Assessment
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Total Assessments</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <FileQuestion className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-600">All assessments</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">Published</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">{stats.published}</div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600">Active assessments</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-yellow-700 font-medium">Drafts</div>
                            <div className="text-3xl font-bold text-yellow-900 mt-1">{stats.draft}</div>
                        </div>
                        <div className="p-3 bg-yellow-500 text-white rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-yellow-600">Work in progress</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-700 font-medium">Archived</div>
                            <div className="text-3xl font-bold text-gray-900 mt-1">{stats.archived}</div>
                        </div>
                        <div className="p-3 bg-gray-500 text-white rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600">Inactive assessments</div>
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
                            placeholder="Search assessments by title or description..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
                            >
                                <option value="all">All Types</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                                <option value="test">Test</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        onClick={() => { setFilterType("all"); setFilterStatus("all"); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === "all" && filterStatus === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Assessments
                    </button>
                    <button
                        onClick={() => setFilterStatus("published")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "published" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Published
                    </button>
                    <button
                        onClick={() => setFilterStatus("draft")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "draft" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Drafts
                    </button>
                    <button
                        onClick={() => setFilterType("quiz")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === "quiz" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Quizzes
                    </button>
                </div>
            </div>

            {/* Assessments Grid */}
            {filteredAssessments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAssessments.map((assessment) => (
                        <div
                            key={assessment.id}
                            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(assessment.type)}`}>
                                                {assessment.type.toUpperCase()}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}>
                                                {assessment.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                            {assessment.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assessment.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <FileQuestion className="w-4 h-4" />
                                            {assessment.questions_count} questions
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {assessment.duration} min
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created {formatRelativeTime(assessment.created_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <div className="flex items-center justify-between gap-2">
                                    <Link href={`/employer/assessments/${assessment.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/employer/assessments/${assessment.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => deleteAssessment(assessment.id)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <FileQuestion className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No assessments found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        {searchTerm || filterType !== "all" || filterStatus !== "all"
                            ? "No assessments match your criteria. Try adjusting your filters."
                            : "Create your first assessment to start evaluating candidates."}
                    </p>
                    <Link href="/employer/assessments/create">
                        <Button className="bg-primary text-white">Create Assessment</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
