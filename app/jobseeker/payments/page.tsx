"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Download, Calendar, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate, formatCurrency } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

interface Transaction {
    id: number;
    type: "payment" | "withdrawal" | "refund";
    amount: number;
    description: string;
    status: string;
    created_at: string;
}

export default function JobSeekerPaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axiosClient.get("/payments");
            setTransactions(response.data?.data || response.data || []);
            setBalance(response.data?.balance || 0);
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = transactions
        .filter(t => t.type === "payment" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingPayments = transactions
        .filter(t => t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "payment":
                return <ArrowDownRight className="w-4 h-4 text-green-600" />;
            case "withdrawal":
                return <ArrowUpRight className="w-4 h-4 text-red-600" />;
            case "refund":
                return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "failed":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
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
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
                            <p className="text-gray-600 mt-1">Track your earnings and payment history</p>
                        </div>
                    </div>
                </div>
                <Button className="bg-primary text-white">
                    <Download className="w-4 h-4" />
                    Download Statement
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-green-700 font-medium">Total Earnings</div>
                            <div className="text-3xl font-bold text-green-900 mt-1">{formatCurrency(totalEarnings)}</div>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600">All-time earnings</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Available Balance</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{formatCurrency(balance)}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-600">Ready to withdraw</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-yellow-700 font-medium">Pending</div>
                            <div className="text-3xl font-bold text-yellow-900 mt-1">{formatCurrency(pendingPayments)}</div>
                        </div>
                        <div className="p-3 bg-yellow-500 text-white rounded-xl">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-yellow-600">Processing payments</div>
                </div>
            </div>

            {/* Transactions */}
            {transactions.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Transaction History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Description</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {getTransactionIcon(transaction.type)}
                                                <span className="capitalize font-medium text-gray-900">{transaction.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{transaction.description}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700">{formatDate(transaction.created_at)}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                                                {transaction.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className={`font-semibold ${transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}>
                                                {transaction.type === "withdrawal" ? "-" : "+"}{formatCurrency(transaction.amount)}
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
                        <DollarSign className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No transaction history</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Your payment history will appear here once you start receiving payments.
                    </p>
                </div>
            )}
        </div>
    );
}
