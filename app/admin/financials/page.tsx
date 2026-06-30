"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import Link from "next/link"
import {
    BadgeDollarSign, TrendingUp, ArrowUpRight, ArrowDownRight,
    Wallet, CreditCard, Banknote, History, Download,
    Filter, Search, CheckCircle2, AlertCircle, PieChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/helpers"

export default function AdminFinancialsPage() {
    const [finStats, setFinStats] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFinancials()
    }, [])

    const fetchFinancials = async () => {
        try {
            // Mocking financial data
            setFinStats({
                total_processed: 45200000, // 45.2M MWK
                platform_fees: 4520000,    // 10% average
                active_escrows: 12500000,
                withdrawals_pending: 850000,
                growth: 12.5
            })
            setTransactions([
                { id: "TX-901", type: "escrow_deposit", user: "Sunbird Hotels", amount: 1500000, fee: 150000, status: "completed", date: "2024-03-30" },
                { id: "TX-902", type: "payout", user: "John Phiri", amount: 450000, fee: 0, status: "pending", date: "2024-03-30" },
                { id: "TX-903", type: "platform_fee", user: "System", amount: 25000, fee: 0, status: "completed", date: "2024-03-29" },
                { id: "TX-904", type: "escrow_deposit", user: "TNM Malawi", amount: 3000000, fee: 300000, status: "completed", date: "2024-03-28" },
            ])
        } catch (err) {
            console.error("Failed to fetch financials")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 font-display italic">Financial <span className="text-er-primary">Intelligence</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Monitor platform revenue, escrow flows, and settlement audits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-slate-900 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-slate-900/20">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all ring-1 ring-slate-100">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-emerald-500/20">
                        <BadgeDollarSign className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Processed (MWK)</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{formatCurrency(finStats.total_processed)}</h3>
                    <div className="mt-4 flex items-center gap-1 text-emerald-500 text-[11px] font-bold">
                        <TrendingUp className="w-3 h-3" /> +{finStats.growth}% this month
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-er-primary/30 transition-all ring-1 ring-slate-100">
                    <div className="p-4 bg-er-primary text-white rounded-2xl w-fit mb-6 shadow-lg shadow-er-primary/20">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Commission</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{formatCurrency(finStats.platform_fees)}</h3>
                    <div className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-tighter">10% Platform Slice</div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all ring-1 ring-slate-100">
                    <div className="p-4 bg-blue-500 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-blue-500/20">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active in Escrow</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{formatCurrency(finStats.active_escrows)}</h3>
                    <div className="mt-4 text-[10px] text-blue-500 font-bold uppercase tracking-tighter cursor-help italic underline">Risk Exposure: Secure</div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all ring-1 ring-slate-100">
                    <div className="p-4 bg-amber-500 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-amber-500/20">
                        <Banknote className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Queue Payouts</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{formatCurrency(finStats.withdrawals_pending)}</h3>
                    <div className="mt-4 flex items-center gap-1 text-amber-500 text-[11px] font-bold cursor-pointer">
                        <AlertCircle className="w-3 h-3" /> 8 Requests Awaiting Approval
                    </div>
                </div>
            </div>

            {/* Transactions Audit */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <History className="w-5 h-5 text-er-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 font-display">Transaction <span className="text-er-primary">Ledger</span></h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tx-id or user..."
                                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-er-primary outline-none text-sm w-64 shadow-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-bold text-slate-400 tracking-[0.2em]">
                                <th className="px-10 py-5">Transaction Details</th>
                                <th className="px-10 py-5">User/Actor</th>
                                <th className="px-10 py-5">Value (MWK)</th>
                                <th className="px-10 py-5">System Fee</th>
                                <th className="px-10 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="text-sm font-bold text-slate-900 tracking-tighter uppercase">{tx.id}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tx.date}</div>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-bold text-slate-600">
                                        {tx.user}
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className={`text-sm font-bold ${tx.type === "payout" ? "text-rose-500" : "text-emerald-500"}`}>
                                            {tx.type === "payout" ? "-" : "+"}{formatCurrency(tx.amount)}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tx.type.replace("_", " ")}</p>
                                    </td>
                                    <td className="px-10 py-6 font-bold text-slate-400 text-xs">
                                        {tx.fee > 0 ? formatCurrency(tx.fee) : "--"}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current shadow-sm ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        End-of-day settlement automatic. Next run in <span className="text-er-primary">4h 22m</span>
                    </p>
                    <Link href="/admin/financials/ledger">
                        <Button variant="link" className="text-er-primary font-bold uppercase tracking-[0.2em] text-xs">Full Global Ledger →</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
