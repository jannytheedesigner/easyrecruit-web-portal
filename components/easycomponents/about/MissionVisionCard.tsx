import React from "react";
import { cn } from "@/lib/utils";

interface MissionVisionCardProps {
    title: string;
    description: string;
    variant?: "default" | "secondary"; // Assuming both are purple for now based on image, but keeping flexible
}

export const MissionVisionCard = ({ title, description, variant = "default" }: MissionVisionCardProps) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-er-primary p-8 md:p-12 h-full flex flex-col justify-center">

            <div className="">
                <div className="flex gap-4 mb-3">
                    {/* Yellow Pill Decoration */}
                    <div className="w-3 h-6 bg-er-secondary rounded-full my-auto" />
                    <h3 className="text-2xl md:text-3xl font-medium primary-font text-white my-auto">
                        {title}
                    </h3>
                </div>

                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        </div>
    );
};
