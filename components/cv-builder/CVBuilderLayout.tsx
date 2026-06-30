"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Loader as LoaderIcon } from "lucide-react";
import { ReactNode } from "react";

interface CVBuilderStep {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CVBuilderLayoutProps {
    steps: CVBuilderStep[];
    currentStep: number;
    children: ReactNode;
    onNext: () => Promise<void>;
    onBack: () => void;
    isLoading?: boolean;
    isFinalStep?: boolean;
    showProgressBar?: boolean;
}

export function CVBuilderLayout({
    steps,
    currentStep,
    children,
    onNext,
    onBack,
    isLoading = false,
    isFinalStep = false,
    showProgressBar = true,
}: CVBuilderLayoutProps) {
    const router = useRouter();
    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Back */}
                        <div className="flex items-center gap-4 min-w-0">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <Link href="/jobseeker/cvs" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-er-primary rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
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
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-bold text-gray-900">EasyCV</h1>
                                    <p className="text-xs text-gray-500">CV Builder</p>
                                </div>
                            </Link>
                        </div>

                        {/* Steps Indicator - Desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${currentStep === idx
                                                ? "bg-er-primary/10 text-er-primary"
                                                : currentStep > idx
                                                    ? "bg-green-100 text-green-600"
                                                    : "text-gray-400"
                                            }`}
                                    >
                                        <step.icon className="w-3 h-3" />
                                        <span className="hidden lg:inline">{step.title}</span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="mx-1 text-gray-300">/</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/jobseeker/cvs"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Exit
                            </Link>
                            <button
                                onClick={onNext}
                                disabled={isLoading}
                                className="px-4 py-2 bg-er-primary hover:bg-er-primary/90 disabled:bg-er-primary/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        {isFinalStep ? "Finish" : "Next"}
                                        {!isFinalStep && <ChevronRight className="w-4 h-4" />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {showProgressBar && (
                        <div className="h-1 bg-gray-200">
                            <div
                                className="h-full bg-er-primary transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-xl p-8">
                            {/* Step Title */}
                            <div className="mb-8 pb-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {steps[currentStep]?.title}
                                </h2>
                                <p className="text-gray-600">
                                    {steps[currentStep]?.description}
                                </p>
                            </div>

                            {/* Content */}
                            {children}
                        </div>
                    </div>

                    {/* Sidebar - Step Progress */}
                    <div className="hidden lg:block w-full lg:w-64">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Progress</h3>
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${currentStep === idx
                                                ? "bg-er-primary/5 border border-er-primary/20"
                                                : currentStep > idx
                                                    ? "bg-green-50 border border-green-200"
                                                    : "bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${currentStep === idx
                                                    ? "bg-er-primary text-white"
                                                    : currentStep > idx
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-300 text-white"
                                                }`}
                                        >
                                            {currentStep > idx ? "✓" : idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
