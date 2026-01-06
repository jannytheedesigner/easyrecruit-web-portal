"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "oxisverse-logo-system";
import { UserTypeCard } from "@/components/easycomponents/user-type-card";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [hoveredType, setHoveredType] = useState<"jobseeker" | "employer" | null>(null);

    const handleSelect = (type: "jobseeker" | "employer") => {
        router.push(`/auth/register/${type}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <div className="flex justify-center mb-6">
                    <Logo
                        brandName="easyrecruit"
                        type="brandmark"
                        variant="main"
                        format="svg"
                        width={60}
                        height={60}
                        alt="EasyRecruit Logo"
                        className="flex w-16"
                    />
                </div>
                <h2 className="text-4xl primary-font font-bold tracking-tight text-gray-900">
                    Welcome to EasyRecruit
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Choose your account type to get started
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-3xl px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div onMouseEnter={() => setHoveredType("jobseeker")} onMouseLeave={() => setHoveredType(null)}>
                        <UserTypeCard
                            type="jobseeker"
                            title="I'm looking for a job"
                            details="Create a profile, browse openings, and find your dream career opportunity."
                            onSelect={() => handleSelect("jobseeker")}
                            selected={hoveredType === "jobseeker"}
                        />
                    </div>

                    <div onMouseEnter={() => setHoveredType("employer")} onMouseLeave={() => setHoveredType(null)}>
                        <UserTypeCard
                            type="employer"
                            title="I'm looking for talent"
                            details="Post jobs, manage candidates, and build your dream team efficiently."
                            onSelect={() => handleSelect("employer")}
                            selected={hoveredType === "employer"}
                        />
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-er-primary hover:text-er-primary-dark hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
