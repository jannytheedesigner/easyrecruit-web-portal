"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function EasyCVLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBuilder = pathname.includes("/create") || pathname.includes("/edit");

    // If we are in the builder, it has its own layout/header, so we just return children
    if (isBuilder) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple EasyCV Header for non-builder pages */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/jobseeker/dashboard" 
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                                title="Back to Dashboard"
                            >
                                <Home className="w-5 h-5" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-lg font-bold text-slate-900 tracking-tight">EasyCV</h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/jobseeker/dashboard" 
                                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                Back to Main App
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="py-10">
                {children}
            </main>
        </div>
    );
}
