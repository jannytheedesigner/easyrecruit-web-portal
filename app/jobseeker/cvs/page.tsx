"use client";

import { useEffect, useState } from "react";
import { Plus, Download, Eye, Edit, Trash2, FileText, Star, Calendar, CheckCircle } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CV {
    id: number;
    title: string;
    template: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    personal_info?: {
        full_name: string;
        email: string;
        phone: string;
        location: string;
    };
}

export default function CVsPage() {
    const [cvs, setCvs] = useState<CV[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCVs();
    }, []);

    const fetchCVs = async () => {
        try {
            const response = await axiosClient.get("/cvs");
            setCvs(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch CVs:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCV = async (id: number) => {
        if (!confirm("Are you sure you want to delete this CV?")) return;
        try {
            await axiosClient.delete(`/cvs/${id}`);
            setCvs(cvs.filter(cv => cv.id !== id));
        } catch (error) {
            console.error("Failed to delete CV:", error);
        }
    };

    const setDefaultCV = async (id: number) => {
        try {
            await axiosClient.patch(`/cvs/${id}/set-default`);
            setCvs(cvs.map(cv => ({ ...cv, is_default: cv.id === id })));
        } catch (error) {
            console.error("Failed to set default CV:", error);
        }
    };

    const downloadCV = async (id: number, title: string) => {
        try {
            const response = await axiosClient.get(`/cvs/${id}/download`, {
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download CV:", error);
            alert("Failed to download CV. Please try again.");
        }
    };

    const stats = {
        total: cvs.length,
        default: cvs.filter(cv => cv.is_default).length,
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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My CVs</h1>
                            <p className="text-gray-600 mt-1">Create, manage and download your CVs</p>
                        </div>
                    </div>
                </div>
                <Link href="/jobseeker/cvs/create">
                    <Button className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                        <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
                            <Plus className="w-4 h-4" />
                        </div>
                        Create New CV
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Total CVs</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-600">All your CVs</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">Default CV</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">{stats.default}</div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600">Used for applications</div>
                </div>
            </div>

            {/* CVs Grid */}
            {cvs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cvs.map((cv) => (
                        <div
                            key={cv.id}
                            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300"
                        >
                            {/* CV Preview/Header */}
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {cv.is_default && (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Default
                                                </span>
                                            )}
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                {cv.template}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                            {cv.title}
                                        </h3>
                                        {cv.personal_info && (
                                            <p className="text-sm text-gray-600 mt-2">{cv.personal_info.full_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>Updated {formatRelativeTime(cv.updated_at)}</span>
                                </div>
                            </div>

                            {/* CV Actions */}
                            <div className="p-4 bg-white">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <Button
                                        onClick={() => downloadCV(cv.id, cv.title)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                    <Link href={`/jobseeker/cvs/${cv.id}`} className="w-full">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/jobseeker/cvs/${cv.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>

                                    {!cv.is_default && (
                                        <Button
                                            onClick={() => setDefaultCV(cv.id)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Star className="w-4 h-4" />
                                            Set Default
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() => deleteCV(cv.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No CVs yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        Create your first CV to start applying for jobs. You can create multiple CVs for different job types.
                    </p>
                    <Link href="/jobseeker/cvs/create">
                        <Button className="bg-primary text-white">
                            <Plus className="w-4 h-4" />
                            Create Your First CV
                        </Button>
                    </Link>
                </div>
            )}

            {/* Tips Section */}
            {cvs.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500 text-white rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">CV Tips</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Keep your CV updated with your latest experience and skills</li>
                                <li>• Tailor your CV for different job types by creating multiple versions</li>
                                <li>• Set a default CV to use for quick applications</li>
                                <li>• Download as PDF to ensure formatting stays consistent</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
