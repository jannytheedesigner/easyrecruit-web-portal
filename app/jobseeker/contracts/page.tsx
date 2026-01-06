"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatCurrency } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "completed":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle className="w-4 h-4" />;
            case "completed":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
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
                            <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
                            <p className="text-gray-600 mt-1">View and manage your active contracts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">Active Contracts</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">
                                {contracts.filter(c => c.status === "active").length}
                            </div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Completed</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">
                                {contracts.filter(c => c.status === "completed").length}
                            </div>
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
                            <div className="text-3xl font-bold text-yellow-900 mt-1">
                                {contracts.filter(c => c.status === "pending").length}
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-500 text-white rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contracts List */}
            {contracts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Contract</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Start Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">End Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map((contract) => (
                                    <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{contract.title}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusColor(contract.status)}`}>
                                                {getStatusIcon(contract.status)}
                                                {contract.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{formatDate(contract.start_date)}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">
                                                {contract.end_date ? formatDate(contract.end_date) : "Ongoing"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-gray-900">{formatCurrency(contract.amount)}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No active contracts</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don't have any active contracts yet. Once you are hired, your contracts will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
