import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AboutHeroProps {
    title: string;
    subtitle: string;
    className?: string;
}

export const AboutHero = ({ title, subtitle, className }: AboutHeroProps) => {
    return (
        <section className={cn(
            "relative w-full overflow-hidden rounded-3xl bg-er-dark py-20 lg:py-20",
            className
        )}>
            <Image src="/brand-assets/visual-assets/illustrations/about-hero.png" width={400} height={400} alt="hero-section" className="absolute object-cover inset-0 w-full h-full" unoptimized />

            <div className="container mx-auto px-6 md:px-16 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="primary-font text-4xl md:text-4xl lg:text-5xl font-medium text-white mb-3 leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 leading-[110%] max-w-2xl">
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
};
