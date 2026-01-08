import React from "react";
import { UserTypeIcon } from "./user-type-icon";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    sectionSubCaption: string;
    sectionTitle: string;
    className?: string;
    align?: "left" | "center" | "right";
    titleClassName?: string;
    subCaptionClassName?: string;
    pillClassName?: string;
}

export const SectionHeader = ({
    sectionSubCaption,
    sectionTitle,
    className,
    align = "left",
    titleClassName,
    subCaptionClassName,
    pillClassName,
}: SectionHeaderProps) => {
    return (
        <div className={cn("flex flex-col gap-3", {
            "items-start text-left": align === "left",
            "items-center text-center": align === "center",
            "items-end text-right": align === "right",
        }, className)}>
            <div className="flex items-center gap-2">
                <div className={cn("py-1 rounded-full bg-er-primary pl-1 pr-3", pillClassName)}>
                    <div className="h-2 w-4 rounded-full bg-er-white">
                    </div>
                </div> {/* Decorative pill */}
                <span className={cn("text-er-primary font-bold tracking-[0.5em] text-xs uppercase leading-[100%] my-auto", subCaptionClassName)}>
                    {sectionSubCaption}
                </span>
            </div>
            <h2 className={cn("text-3xl md:text-5xl primary-font font-medium text-gray-900 leading-t[100%]", titleClassName)}>
                {sectionTitle}
            </h2>
        </div>
    );
};
