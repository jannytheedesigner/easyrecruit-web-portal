"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JobSeekerContractDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <Link href="/jobseeker/contracts" className="flex items-center text-sm text-gray-600 hover:text-er-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contracts
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Contract Details</h1>
                <p className="text-gray-600">Viewing contract details for ID: {params.id}</p>
                {/* Placeholder for actual contract details */}
                <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-500 italic">Contract details module to be implemented.</p>
                </div>
            </div>
        </div>
    );
}
