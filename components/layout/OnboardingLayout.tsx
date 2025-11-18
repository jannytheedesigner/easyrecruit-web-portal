import { Button } from "@/components/easycomponents/button";
import Link from "next/link";
import { TopBar } from "../layout/TopBar"
import UserTypeSelector from "../easycomponents/user-type-selector";
import StripPattern from "../easycomponents/strip-pattern";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:from-gray-900 dark:to-gray-800 gap-6">
            <TopBar />
            {children}
            <StripPattern />
        </div>
    );
}