"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Contract } from "@/types/contract"
import { FileText, Search, Filter } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/helpers"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    useEffect(() => {
        fetchContracts()
    }, [])

    const fetchContracts = async () => {
        try {
            const response = await axiosClient.get("/contracts")
            setContracts(response.data.data || [])
        } catch (error) {
            console.error("Failed to fetch contracts:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredContracts = contracts.filter((contract) => {
        const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === "all" || contract.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700"
            case "completed":
                return "bg-blue-100 text-blue-700"
            case "pending":
                return "bg-yellow-100 text-yellow-700"
            case "cancelled":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
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
                <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
                <p className="text-gray-600 mt-1">Manage all employment contracts</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search contracts..."
                            className="texts-sm tracking-tight w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-er-primary focus:border-transparent bg-gray-50"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full md:w-[200px] px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-er-primary focus:border-er-primary bg-gray-50 data-[state=open]:ring-2 data-[state=open]:ring-primary">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <SelectValue placeholder="All Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contract</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">End Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredContracts.map((contract) => (
                                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">{contract.title}</p>
                                            <p className="text-sm text-gray-600 line-clamp-1">{contract.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(contract.amount)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(contract.start_date)}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {contract.end_date ? formatDate(contract.end_date) : "Ongoing"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredContracts.length === 0 && (
                <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No contracts found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    )
}
