"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import type { Application } from "@/types/application";
import {
    ArrowLeft,
    Star,
    Download,
    MessageSquare,
    CheckCircle,
    Clock,
    XCircle,
    TrendingUp,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Award,
} from "lucide-react";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

const STATUS_OPTIONS = [
    { value: "applied", label: "Applied" },
    { value: "viewed", label: "Viewed" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "assessed", label: "Assessed" },
    { value: "interview", label: "Interview" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
];

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (params.id && params.applicationId) {
            fetchApplication();
        }
    }, [params.id, params.applicationId]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                `/employer/applications/${params.applicationId}`
            );
            setApplication(response.data?.data || response.data);
        } catch (error) {
            console.error("Failed to fetch application:", error);
            toast({
                title: "Error",
                description: "Failed to load application details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!application) return;

        try {
            setUpdating(true);
            await axiosClient.patch(
                `/employer/applications/${application.id}/status`,
                { status: newStatus }
            );

            setApplication({
                ...application,
                status: newStatus as any,
            });

            toast({
                title: "Success",
                description: `Candidate status updated to ${STATUS_OPTIONS.find((s) => s.value === newStatus)?.label}`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    "Failed to update status. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    const getMatchColor = (score: number) => {
        if (score >= 80) return "bg-green-100 text-green-700";
        if (score >= 50) return "bg-blue-100 text-blue-700";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "applied":
                return "bg-blue-100 text-blue-700";
            case "viewed":
                return "bg-purple-100 text-purple-700";
            case "shortlisted":
                return "bg-indigo-100 text-indigo-700";
            case "assessed":
                return "bg-orange-100 text-orange-700";
            case "interview":
                return "bg-pink-100 text-pink-700";
            case "hired":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-gray-600 mb-4">Application not found</p>
                <Link
                    href={`/employer/jobs/${params.id}/applicants`}
                    className="text-blue-600 hover:text-blue-700"
                >
                    ← Back to Applications
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/employer/jobs/${params.id}/applicants`}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {application.jobseeker?.name || "Unknown"}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {application.jobseeker?.title || "No title"}
                                </p>
                            </div>
                        </div>

                        {application.is_highlighted && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <Star className="w-5 h-5 text-amber-500" />
                                <span className="font-semibold text-amber-700">Top Applicant</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                {application.jobseeker?.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <a
                                            href={`mailto:${application.jobseeker.email}`}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            {application.jobseeker.email}
                                        </a>
                                    </div>
                                )}
                                {application.jobseeker?.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <a
                                            href={`tel:${application.jobseeker.phone}`}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            {application.jobseeker.phone}
                                        </a>
                                    </div>
                                )}
                                {application.jobseeker?.years_of_experience && (
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">
                                            {application.jobseeker.years_of_experience} years of experience
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">
                                        Applied {formatDate(application.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Application Details */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Application Details
                            </h2>
                            {application.cover_letter && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">Cover Letter</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {application.cover_letter}
                                    </p>
                                </div>
                            )}
                            {!application.cover_letter && (
                                <p className="text-gray-500">No cover letter provided</p>
                            )}
                        </div>

                        {/* Resume */}
                        {application.resume_id && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Resume</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                                    <Download className="w-4 h-4" />
                                    Download Resume
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Match Score Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">
                                Match Score
                            </h3>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                    {Math.round(application.match_score)}%
                                </div>
                                <p
                                    className={`px-4 py-2 rounded-full text-sm font-bold inline-block ${getMatchColor(
                                        application.match_score
                                    )}`}
                                >
                                    {application.match_label}
                                </p>
                            </div>

                            {/* Match Breakdown */}
                            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Skills Match</span>
                                    <span className="font-bold text-gray-900">
                                        {Math.round(application.match_score * 0.4)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{
                                            width: `${Math.round(application.match_score * 0.4)}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-sm text-gray-600">Experience Match</span>
                                    <span className="font-bold text-gray-900">
                                        {Math.round(application.match_score * 0.3)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{
                                            width: `${Math.round(application.match_score * 0.3)}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-sm text-gray-600">Title Match</span>
                                    <span className="font-bold text-gray-900">
                                        {Math.round(application.match_score * 0.3)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{
                                            width: `${Math.round(application.match_score * 0.3)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Update Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">
                                Current Status
                            </h3>
                            <div className="mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${getStatusColor(
                                        application.status
                                    )}`}
                                >
                                    {STATUS_OPTIONS.find((s) => s.value === application.status)
                                        ?.label}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-600 mb-3">
                                    Move to:
                                </p>
                                {STATUS_OPTIONS.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusUpdate(status.value)}
                                        disabled={
                                            updating || application.status === status.value
                                        }
                                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-left ${application.status === status.value
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">
                                Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    Send Message
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                    <CheckCircle className="w-4 h-4" />
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

