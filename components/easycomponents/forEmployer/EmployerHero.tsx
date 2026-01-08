import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, BarChart3, Badge, Users, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { PartnerSlide } from "../PartnerSlide";

interface EmployerHeroProps {
    caption: string;
    title: string;
    subtitle: string;
    className?: string;
}

export const EmployerHero = ({ caption, title, subtitle, className }: EmployerHeroProps) => {
    return (
        <section className={cn(
            "relative w-full overflow-hidden rounded-3xl bg-er-dark py-20 lg:py-20",
            className
        )}>
            <Image src="/brand-assets/visual-assets/illustrations/match-and-hire.png" width={400} height={400} alt="hero-section" className="absolute object-cover inset-0 w-full h-full" unoptimized />
            <div className="absolute w-full h-full bg-er-dark/60 mix-blend-multiply top-0 bottom-0"></div>
            <div className="absolute w-full h-full bg-gradient-to-t from-er-primary to-er-primary/0 top-0 bottom-0 z-20"></div>
            <section className="text-white relative z-40">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-er-primary primary-font text-white hover:bg-er-primary mb-3 px-4 py-1.5 text-sm rounded-full pointer-events-none w-fit mx-auto">
                        {caption}
                    </div>
                    <h1 className="text-4xl md:text-5xl max-w-3xl mx-auto primary-font lg:text-6xl font-medium mb-6 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-lg text-gray-100 max-w-xl mx-auto mb-6">
                        {subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-er-secondary hover:bg-er-secondary-light text-er-dark">
                            <Link href="/auth/register?role=employer">Post a Job for Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-er-white">
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </div>
            </section>
            <div className="dark:block hidden relative z-40">
                <PartnerSlide />
            </div>

        </section>
    );
};
