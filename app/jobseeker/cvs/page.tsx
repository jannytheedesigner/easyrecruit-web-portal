"use client";

import { useEffect, useState } from "react";
import { Plus, Download, Eye, Edit, Trash2, FileText, Star, Calendar, CheckCircle, Sparkles, ChevronRight, ArrowBigRight, ArrowRight } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CV {
    id: number;
    title: string;
    template_name: string;
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
            const response = await axiosClient.get("/resumes");
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
            await axiosClient.delete(`/resumes/${id}`);
            setCvs(cvs.filter(cv => cv.id !== id));
        } catch (error) {
            console.error("Failed to delete CV:", error);
        }
    };

    const setDefaultCV = async (id: number) => {
        try {
            await axiosClient.patch(`/resumes/${id}/set-default`);
            setCvs(cvs.map(cv => ({ ...cv, is_default: cv.id === id })));
        } catch (error) {
            console.error("Failed to set default CV:", error);
        }
    };

    const downloadCV = async (id: number, title: string) => {
        try {
            const response = await axiosClient.get(`/resumes/${id}/download`, {
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
        <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* High-End CV Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">
                        Professional <span className="text-er-primary not-italic">Portfolio</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Curate and manage your strategic career documents.</p>
                </div>
                <Link href="/jobseeker/cvs/create">
                    <Button className="py-4 bg-slate-900 hover:bg-er-primary text-white rounded-full px-10 font-bold uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5" /> Create New CV
                    </Button>
                </Link>
            </div>

            {/* Premium Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                    <div className="relative flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Repository</div>
                            <div className="text-4xl font-bold text-slate-900 font-display">{stats.total}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Documents Archived</div>
                        </div>
                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-er-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                    <div className="relative flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-er-primary uppercase tracking-widest">Active Identity</div>
                            <div className="text-4xl font-bold text-slate-900 font-display">{stats.default}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Primary Application Asset</div>
                        </div>
                        <div className="w-16 h-16 bg-er-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-er-primary/20 group-hover:-rotate-6 transition-transform">
                            <Star className="w-8 h-8 fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Collection Grid */}
            {cvs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {cvs.map((cv) => (
                        <div
                            key={cv.id}
                            className="group bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-slate-200 transition-all duration-500 relative flex flex-col"
                        >
                            {cv.is_default && (
                                <div className="absolute top-6 right-6 px-4 py-1.5 bg-er-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-er-primary/20 flex items-center gap-2 z-10">
                                    <CheckCircle className="w-3 h-3" /> Principal
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="w-16 h-20 bg-slate-50 border-2 border-slate-100 rounded-xl mb-6 flex flex-col items-center justify-center relative group-hover:border-er-primary/30 group-hover:bg-white transition-all">
                                    <FileText className="w-8 h-8 text-slate-300 group-hover:text-er-primary transition-colors" />
                                    <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-slate-200 rounded-full" />
                                    <div className="absolute bottom-4 left-2 right-4 h-0.5 bg-slate-200 rounded-full" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-er-primary transition-colors">
                                    {cv.title}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{cv.template_name} Style</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> {formatRelativeTime(cv.updated_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => downloadCV(cv.id, cv.title)}
                                        className="h-12 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl font-bold uppercase tracking-widest text-[10px] border border-slate-100 transition-all"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-12 border-slate-100 hover:border-slate-900 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        <Link href={`/jobseeker/cvs/${cv.id}`}>
                                            <Eye className="w-4 h-4 mr-2" /> Preview
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        asChild
                                        className="flex-1 bg-white border border-slate-100 hover:border-er-primary hover:text-white text-slate-900 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all py-4"
                                    >
                                        <Link className="flex justify-between" href={`/jobseeker/cvs/${cv.id}/edit`}>
                                            <p className="text-[10px]">Edit Layout</p>
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                        </Link>
                                    </Button>
                                    {!cv.is_default && (
                                        <Button
                                            onClick={() => setDefaultCV(cv.id)}
                                            className="h-12 w-12 bg-white border border-slate-100 hover:bg-er-primary hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                                            title="Set as Principal"
                                        >
                                            <Star className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => deleteCV(cv.id)}
                                        className="h-12 w-12 bg-white border border-slate-100 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm group/del"
                                    >
                                        <Trash2 className="w-4 h-4 text-slate-400 group-hover/del:text-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] border border-slate-100 p-24 shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-er-primary/20 to-transparent" />
                    <div className="w-32 h-32 mx-auto mb-10 bg-slate-50/50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 ring-8 ring-slate-50 transition-transform hover:scale-110 duration-700">
                        <FileText className="w-16 h-16 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 font-display uppercase tracking-tight mb-4">No Strategic Documents</h3>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto mb-12 text-lg">
                        Your professional portfolio is currently empty. Design your first high-impact CV to begin your strategic employment journey.
                    </p>
                    <Link href="/jobseeker/cvs/create">
                        <Button className="h-20 bg-slate-900 hover:bg-er-primary text-white rounded-[2rem] px-16 font-bold uppercase tracking-[0.2em] text-sm shadow-2xl shadow-slate-200 transition-all hover:scale-105">
                            <Plus className="w-6 h-6 mr-4" /> Blueprint First CV
                        </Button>
                    </Link>
                </div>
            )}

            {/* Strategic Insights Card */}
            {cvs.length > 0 && (
                <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-er-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-er-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-er-primary/20 shrink-0">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-bold font-display uppercase tracking-tight">Pro-Tier Portfolio Insights</h3>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                                Multiple CV versions allow you to target different strategic roles. Your principal document is automatically synced with high-match job opportunities across the EasyRecruit network.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
