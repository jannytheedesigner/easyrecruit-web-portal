"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, Briefcase, Users, ArrowRight, Star, TrendingUp, Shield, Clock, AlertCircle, Database, BrainCircuit, ListOrdered } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/easycomponents/SectionHeader";
import { FeatureCard } from "@/components/easycomponents/FeatureCard";
import { RoleCard } from "@/components/easycomponents/RoleCard";
import { TestimonialCard } from "@/components/easycomponents/TestimonialCard";
import { PartnerSlide } from "@/components/easycomponents/PartnerSlide";
import { ArticleCard } from "@/components/easycomponents/ArticleCard";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-0">
                <section className="relative px-10 py-20 overflow-hidden bg-er-primary-dark container mx-auto rounded-3xl">
                    <Image src="/brand-assets/visual-assets/illustrations/easyrecruit-hero.png" width={400} height={400} alt="hero-section" className="absolute object-cover inset-0 w-full h-full" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/50 to-black/0" />
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-3 gap-12 items-center">
                            <div className="flex flex-col col-span-2 gap-6 text-center lg:text-left">
                                <h1 className="text-4xl primary-font md:text-5xl lg:text-6xl tracking-tight text-white leading-[100%]">
                                    Hire the top 1% from 1,000+ applicants in minutes<span className="text-er-complimentary">.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0">
                                    Join Easy Recruit to hire smarter or get hired faster an all in one powerful, easy to use recruitment platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" className="h-12 px-8 text-base bg-[#090033]/0 border border-er-complimentary text-white hover:bg-er-complimentary/90 rounded-full">
                                        <Link href="/auth/register?role=employer">Find Talent</Link>
                                    </Button>
                                    <Button size="lg" className="h-12 px-8 text-base bg-white text-[#090033] hover:bg-gray-100 rounded-full border border-transparent">
                                        <Link href="/jobs">Find a Job</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            {/* The Problem Section (The "Why") */}
            <section className="py-20 bg-gray-50 dark:bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">In Africa, the problem isn&apos;t finding candidates. It&apos;s filtering them.</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Emerging market job posts receive 50x the volume of Western roles. Traditional ATS tools are just digital filing cabinets—they don&apos;t help you read. When you receive 2,000 CVs for one role, your best candidates stay buried at the bottom of the inbox.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { label: "Average applicants per role", value: "500+", icon: <Users className="w-8 h-8 text-white" />, color: "bg-er-primary" },
                            { label: "Time wasted on unqualified CVs", value: "80%", icon: <Clock className="w-8 h-8 text-white" />, color: "bg-er-secondary" },
                            { label: "Cost of missing your best hire", value: "$0", icon: <AlertCircle className="w-8 h-8 text-white" />, color: "bg-er-complimentary" }, // $0 cost implies lost opportunity is high, but prompt said "$0 Cost of missing your best hire." - assuming this means "High Cost" or maybe 0 with tool? Prompt: "$0 Cost of missing your best hire." -> This usually means it costs nothing to miss them? Or maybe infinite. Keeping user's text literally.
                            // Actually, likely means "The cost is immense", but user wrote "$0". I will stick to prompt but maybe they meant "High Cost". 
                            // Re-reading prompt: "Key Stats... $0 Cost of missing your best hire." -> Maybe they meant the *Current* cost is high? Or using the tool makes it $0? 
                            // Context: "The Problem". So usually stats are negative. "$0" is strange. I'll maintain it but maybe add a tooltip or change it if user corrects.
                            // Let's assume user meant "High Cost" or meant to say "Human Potential: $0 (wasted)". 
                            // To be safe, I will render exactly "$0" as requested.
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center p-6 bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-border">
                                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                                    {stat.icon}
                                </div>
                                <p className={`primary-font text-4xl font-semibold mb-2 text-gray-900 dark:text-white`}>{stat.value}</p>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Solution Section (How it works) */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <SectionHeader
                            sectionSubCaption="THE SOLUTION"
                            sectionTitle="Turn Chaos into Intelligence"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            image="/brand-assets/visual-assets/illustrations/how-it-work.png"
                            title="Structured Candidate Intake"
                            featurelink="#"
                            description="No more email attachments. Every applicant enters a standardized flow that converts unstructured PDFs into clean, queryable data."
                        />
                        <FeatureCard
                            image="/brand-assets/visual-assets/illustrations/applying.jpg"
                            title="AI Semantic Scoring"
                            featurelink="#"
                            description="Our engine goes beyond keywords. It understands context, intent, and technical aptitude to score candidates against your specific requirements."
                        />
                        <FeatureCard
                            image="/brand-assets/visual-assets/illustrations/match-and-hire.png"
                            title="Decision-Ready Ranking"
                            featurelink="#"
                            description="Stop sorting and start interviewing. View your 'Instant Shortlist' of top-ranked talent the moment you open your dashboard."
                        />
                    </div>
                </div>
            </section>

            {/* Technical Differentiation (The "Moat") */}
            <section className="py-20 bg-er-dark text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                    <Database size={400} />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Built for &quot;Talent Abundance,&quot; not Scarcity.</h2>
                            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                Western hiring tools (Greenhouse, Lever) were built to find one needle in a haystack. EasyRecruit was built to manage the haystack.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                By using Large Language Models (LLMs) to parse local CV formats and identify transferable skills, we provide a &quot;Signal Score&quot; that legacy keyword filters miss.
                            </p>
                        </div>
                        <div className="lg:w-1/2">
                            {/* Abstract Graphic representing AI Filtering */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                <div className="flex items-center gap-4 mb-6">
                                    <BrainCircuit className="text-er-complimentary w-10 h-10" />
                                    <div>
                                        <h3 className="font-bold text-xl">Signal Score™ Engine</h3>
                                        <p className="text-sm text-gray-400">Processing 2,000+ applicants</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-er-complimentary w-[92%]"></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Candidate Quality Matched</span>
                                        <span className="font-bold text-er-complimentary">92%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <p className="text-xs text-gray-400 mb-1">Legacy Keywords</p>
                                            <p className="text-red-400 font-bold">Missed 45% Top Talent</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <p className="text-xs text-gray-400 mb-1">EasyRecruit AI</p>
                                            <p className="text-green-400 font-bold">Identified 100%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Vision (The Billion-Dollar Pitch) */}
            <section className="py-24 bg-white dark:bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <SectionHeader
                            sectionSubCaption="THE VISION"
                            sectionTitle="The Infrastructure for Global Talent"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0 mb-8"
                        />
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                            We are building the standardization layer for the African workforce. Starting with automated recruitment, we are creating the data infrastructure companies rely on to evaluate, verify, and hire the next billion workers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-20 bg-er-primary-light dark:bg-er-accent text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Stop drowning in CVs. Start building your team.</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join 100+ forward-thinking teams using structure to find talent.
                    </p>
                    <Button size="lg" className="h-14 px-12 text-lg bg-white text-er-primary-dark hover:bg-gray-100 font-bold shadow-xl">
                        <Link href="/auth/register">Get Early Access</Link>
                    </Button>
                </div>
                {/* Decorative background elements if needed */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            </section>
        </div>
    );
}
