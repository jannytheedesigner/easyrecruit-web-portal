import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"

interface CoreValueCardProps {
    number: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const CoreValueCard = ({ number, title, description, icon: Icon }: CoreValueCardProps) => {
    return (
        <div className="relative bg-er-accent dark:bg-card dark:border dark:border-border rounded-lg p-8 relative overflow-hidden group duration-300">
            {/* Background Image */}
            <div className="absolute inset-0 z-10">
                <Image
                    src={"/brand-assets/visual-assets/illustrations/testimonial-bg.png"}
                    alt="Background"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <div className="pb-6">
                {/* Icon */}
                <div className="relative z-10 w-12 h-12 bg-er-primary rounded-sm flex items-center justify-center text-white">
                    <Icon size={24} />
                </div>
            </div>

            <div className="relative z-10 pt-6 border-t-1 border-er-dark/20">
                <h3 className="primary-font text-xl font-semibold text-er-primary-dark dark:text-primary mb-2">
                    {number}. {title}
                </h3>
                <p className="text-base text-gray-600 dark:text-muted-foreground leading-[120%]">
                    {description}
                </p>
            </div>
        </div>
    );
};
