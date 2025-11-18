"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { WalletBalance, WalletTransaction } from "@/types/payment"
import { WalletIcon, ArrowUpRight, ArrowDownLeft, Download } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/helpers"

export default function WalletPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axiosClient.get("/wallet/balance"),
        axiosClient.get("/wallet/transactions"),
      ])
      setBalance(balanceRes.data.data)
      setTransactions(transactionsRes.data.data || [])
    } catch (error) {
      console.error("Failed to fetch wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-1">Manage your balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#0d1b8c] to-[#0a1570] rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Available Balance</p>
              <h2 className="text-4xl font-bold">{formatCurrency(balance?.balance || 0)}</h2>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-[#0d1b8c] rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Withdraw
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
          <div>
            <p className="text-sm text-blue-100 mb-1">Total Earned</p>
            <p className="text-2xl font-bold">{formatCurrency(balance?.balance || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-100 mb-1">Pending</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {transaction.type === "credit" ? (
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {transactions.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">Your transaction history will appear here</p>
        </div>
      )}
    </div>
  )
}
