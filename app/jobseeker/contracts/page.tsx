"use client";

import { FileText } from "lucide-react";

export default function JobSeekerContractsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
                <p className="text-gray-600 mt-1">View and manage your active contracts.</p>
            </div>

            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active contracts</h3>
                <p className="text-gray-600">You don't have any active contracts yet. Once you are hired, your contracts will appear here.</p>
            </div>
        </div>
    );
}
