"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

import { TopBar } from "../layout/TopBar"
import StripPattern from "../easycomponents/strip-pattern";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:from-gray-900 dark:to-gray-800">
            <TopBar />
            {children}
            <StripPattern />
        </div>
    );
}