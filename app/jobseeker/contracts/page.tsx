"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Eye, Clock, CheckCircle, AlertCircle, Calendar, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatCurrency } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Contract {
    id: number;
    title: string;
    status: string;
    start_date: string;
    end_date?: string;
    amount: number;
    created_at: string;
}

export default function JobSeekerContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axiosClient.get("/contracts");
            setContracts(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch contracts:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return { 
                    badge: "bg-er-complimentary/10 text-er-complimentary border-er-complimentary/20", 
                    icon: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />,
                    accent: "bg-er-complimentary/5"
                };
            case "completed":
                return { 
                    badge: "bg-er-primary/10 text-er-primary border-er-primary/20", 
                    icon: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />,
                    accent: "bg-er-primary/5"
                };
            case "pending":
                return { 
                    badge: "bg-er-secondary/10 text-er-secondary-dark border-er-secondary/20", 
                    icon: <Clock className="w-3 h-3 md:w-4 md:h-4" />,
                    accent: "bg-er-secondary/5"
                };
            default:
                return { 
                    badge: "bg-slate-50 text-slate-600 border-slate-200", 
                    icon: <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />,
                    accent: "bg-slate-50"
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    const activeContractsCount = contracts.filter(c => c.status === "active").length;
    const completedContractsCount = contracts.filter(c => c.status === "completed").length;
    const pendingContractsCount = contracts.filter(c => c.status === "pending").length;

    return (
        <div className="space-y-10 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">
                        Managed Contracts
                    </h1>
                    <p className="text-slate-500 font-medium">Coordinate and monitor your active professional agreements.</p>
                </div>
                <div className="flex items-center gap-3">
                     <Link href="/jobseeker/jobs">
                        <Button className="bg-er-primary hover:bg-er-primary-dark text-white rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-xl shadow-er-primary/20 transition-all hover:-translate-y-1">
                            Find New Projects
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Primary Content: Contracts Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Active Pipeline</h2>
                    <span className="text-[10px] font-bold text-er-primary bg-er-primary/5 px-3 py-1 rounded-full uppercase">
                        {contracts.length} Total Contracts
                    </span>
                </div>

                {contracts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contracts.map((contract) => {
                            const style = getStatusStyle(contract.status);
                            return (
                                <div key={contract.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 hover:border-er-primary/30 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group flex flex-col justify-between h-full relative overflow-hidden">
                                    {/* Decorative Blur Background */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${style.accent} rounded-bl-[100%] transition-transform group-hover:scale-125 duration-700 pointer-events-none`} />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-er-primary/10 group-hover:text-er-primary group-hover:border-er-primary/20 transition-all duration-500">
                                                <FileText className="w-6 h-6 stroke-[1.5px]" />
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-[10px] font-bold border uppercase tracking-widest flex items-center gap-2 ${style.badge}`}>
                                                {style.icon}
                                                {contract.status}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 mb-8">
                                            <h3 className="font-bold text-slate-900 text-xl group-hover:text-er-primary transition-colors leading-tight font-display">
                                                {contract.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Started {formatDate(contract.start_date)}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-dashed border-slate-200 group-hover:bg-white group-hover:border-er-primary/10 transition-colors">
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agreement value</div>
                                                <div className="text-lg font-bold text-slate-900">{formatCurrency(contract.amount)}</div>
                                            </div>
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-er-complimentary">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100 relative z-10">
                                        <Link href={`/jobseeker/contracts/${contract.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] h-12 border-slate-200 text-slate-600 hover:bg-er-primary hover:text-white hover:border-er-primary transition-all shadow-sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Review Terms
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="w-12 h-12 p-0 rounded-2xl border-slate-200 text-slate-400 hover:text-er-primary hover:bg-er-primary/5 hover:border-er-primary/20 transition-all shadow-sm"
                                            title="Download PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-[3rem] p-20 border border-slate-100 text-center relative overflow-hidden group">
                        {/* Background flare */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-er-primary/5 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                        
                        <div className="relative z-10">
                            <div className="w-28 h-28 mx-auto mb-8 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200/50">
                                <FileText className="w-12 h-12 text-slate-300 stroke-[1.5px]" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">No contracts found</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                                You don't have any formal contracts active at the moment. Contracts are generated automatically once your proposal is accepted by an employer.
                            </p>
                            <Link href="/jobseeker/jobs">
                                <Button className="bg-er-primary hover:bg-er-primary-dark text-white rounded-2xl h-14 px-10 font-bold uppercase tracking-widest text-xs shadow-2xl shadow-er-primary/30 transition-all hover:-translate-y-1">
                                    Project Discovery
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Secondary Content: Stats/Analytics */}
            <div className="pt-10 space-y-8 border-t border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Summary Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-er-complimentary/5 rounded-bl-[100%] -mr-10 -mt-10" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Active Projects</div>
                                <div className="text-3xl font-bold text-slate-900 font-display">{activeContractsCount}</div>
                            </div>
                            <div className="w-14 h-14 bg-er-complimentary/10 rounded-2xl flex items-center justify-center text-er-complimentary">
                                <CheckCircle className="w-7 h-7" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-er-primary/5 rounded-bl-[100%] -mr-10 -mt-10" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Completed</div>
                                <div className="text-3xl font-bold text-slate-900 font-display">{completedContractsCount}</div>
                            </div>
                            <div className="w-14 h-14 bg-er-primary/10 rounded-2xl flex items-center justify-center text-er-primary border border-er-primary/5">
                                <FileText className="w-7 h-7" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-er-secondary/5 rounded-bl-[100%] -mr-10 -mt-10" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Awaiting Signature</div>
                                <div className="text-3xl font-bold text-slate-900 font-display">{pendingContractsCount}</div>
                            </div>
                            <div className="w-14 h-14 bg-er-secondary/10 rounded-2xl flex items-center justify-center text-er-secondary-dark">
                                <Clock className="w-7 h-7" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
