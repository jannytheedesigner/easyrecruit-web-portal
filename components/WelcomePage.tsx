"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/easycomponents/button";
import UserTypeSelector from "./easycomponents/user-type-selector";
import OnboardingLayout from "./layout/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getRoleDashboardPath } from "@/lib/roleRoutes";

export default function WelcomePage() {
    const [selected, setSelected] = useState<"jobseeker" | "employer" | null>(
        null
    );

    const isSelected = !!selected;

    const buttonText = selected
        ? selected === "jobseeker"
            ? "Create Job Seeker Account"
            : "Create Employer Account"
        : "Create an Account";

    const buttonHref = selected
        ? selected === "jobseeker"
            ? "/auth/register/jobseeker"
            : "/auth/register/employer"
        : "#";

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace(getRoleDashboardPath(user.role));
        }
    }, [user, loading, router]);

    return (
        <OnboardingLayout>
            <div className="flex flex-col my-auto container mx-auto">
                <div className="min-w-3xl 2xl:min-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-1 border-b mb-6 border-gray-200">
                        <h1 className="text-4xl tracking-tight font-medium text-er-dark">
                            Welcome to EasyRecruit
                        </h1>
                        <p className="text-base text-muted-foreground mb-4 max-w-2xl">
                            Are you a job seeker or an employer looking to hire someone?
                        </p>
                    </div>

                    {/* Selector */}
                    <UserTypeSelector selected={selected} onSelect={setSelected} />

                    {/* Footer Button */}
                    <div className="mt-8 flex flex-row items-center">
                        <p className="text-base text-gray-600 my-auto">
                            Already have an account?
                            <Link href="/auth/login" className="text-base font-semibold text-er-primary ml-1">
                                Login
                            </Link>
                        </p>
                        <Button
                            variant={isSelected ? "primary" : "gray"}
                            size="lg"
                            disabled={!isSelected}
                            className="text-base ml-auto transition-all disabled:opacity-50"
                        >
                            {isSelected ? (
                                <Link href={buttonHref}>{buttonText}</Link>
                            ) : (
                                buttonText
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
}
