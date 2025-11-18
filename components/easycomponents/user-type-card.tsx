import * as React from "react";
import { cn } from "@/lib/utils";
import { UserTypeIcon } from "./user-type-icon";

interface UserTypeCardProps {
    type: "jobseeker" | "employer";
    title: string;
    details: string;
    selected?: boolean;
    onSelect?: () => void;
}

export const UserTypeCard: React.FC<UserTypeCardProps> = ({
    type,
    title,
    details,
    selected = false,
    onSelect,
}) => {
    const isJobSeeker = type === "jobseeker";

    const bg = selected
        ? isJobSeeker
            ? "bg-er-secondary text-er-dark"
            : "bg-er-primary text-white"
        : "bg-white text-er-dark";

    const border = selected
        ? isJobSeeker
            ? "border-white"
            : "border-white"
        : "border-er-dark/20";

    const ringColor = selected
        ? isJobSeeker
            ? "ring-er-primary"
            : "ring-er-secondary"
        : "ring-gray-200";

    return (
        <button
            onClick={onSelect}
            className={cn(
                "relative flex flex-col items-start gap-4 rounded-2xl border p-6 mb-6 transition-all duration-200 hover:scale-[1.02] focus:outline-none",
                bg,
                border
            )}
        >
            {/* Icon and Radio */}
            <div className="flex items-center justify-between w-full">
                <UserTypeIcon
                    type={type}
                    variant={
                        selected
                            ? isJobSeeker
                                ? "jobseeker"
                                : "employer"
                            : isJobSeeker
                                ? "outlineJobseeker"
                                : "outlineEmployer"
                    }
                />
                <span
                    className={cn(
                        "w-5 h-5 rounded-full ring-2 flex items-center justify-center transition-all duration-200",
                        ringColor
                    )}
                >
                    {selected && (
                        <span
                            className={cn(
                                "w-3.5 h-3.5 rounded-full",
                                isJobSeeker ? "bg-er-primary" : "bg-er-secondary"
                            )}
                        />
                    )}
                </span>
            </div>

            {/* Text Content */}
            <div className="text-left">
                <h3 className="text-lg font-semibold uppercase">{title}</h3>
                <p className="text-sm opacity-80">{details}</p>
            </div>
        </button>
    );
};
