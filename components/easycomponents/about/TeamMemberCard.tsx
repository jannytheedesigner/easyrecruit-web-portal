import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
    name: string;
    role: string;
    image: string;
    isCenter?: boolean; // For the yellow variant in the middle
}

export const TeamMemberCard = ({ name, role, image, isCenter = false }: TeamMemberCardProps) => {
    return (
        <div className="flex flex-col bg-er-accent p-6 rounded-xl relative overflow-hidden">

            <div className={cn(
                "relative z-40 aspect-square w-full rounded-md mb-4",
                isCenter ? "bg-er-secondary" : "bg-er-primary"
            )}>
                <div className="absolute inset-0 z-30 top-[-10em] mix-blend-overlay h-full scale-180">
                    <Image
                        src={"/brand-assets/logo-assets/brandmark/brandmark-easyrecruit-black.png"}
                        alt="Background"
                        fill
                        className="object-cover rotate-180"
                        unoptimized
                    />
                </div>

                <div className={cn(
                    "relative absolute z-20 aspect-square w-full w-full rounded-xl",
                    isCenter ? "bg-er-secondary" : "bg-er-primary"
                )}></div>

                <div className="absolute inset-0 z-10 top-[-10em] h-full scale-180">
                    <Image
                        src={"/brand-assets/logo-assets/brandmark/brandmark-easyrecruit-outline.png"}
                        alt="Background"
                        fill
                        className="object-cover rotate-180"
                        unoptimized
                    />
                </div>


                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-top z-30 pt-4" // pt-4 to showing some bg
                    unoptimized
                />
            </div>

            <div className="relative z-30 bg-transparent">
                <h3 className="text-xl primary-font font-medium text-gray-900 dark:text-white mb-1">
                    {name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-2 rounded-full bg-er-primary inline-block" />
                    <p className="text-xs my-auto font-semibold tracking-[0.3em] text-gray-500 uppercase leading-[100%]">
                        {role}
                    </p>
                </div>
            </div>
        </div>
    );
};
