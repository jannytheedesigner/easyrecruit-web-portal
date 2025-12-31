"use client";

import { DollarSign } from "lucide-react";

export default function JobSeekerPaymentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
                <p className="text-gray-600 mt-1">Track your earnings and payment history.</p>
            </div>

            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No transaction history</h3>
                <p className="text-gray-600">Your payment history will appear here once you start receiving payments.</p>
            </div>
        </div>
    );
}
