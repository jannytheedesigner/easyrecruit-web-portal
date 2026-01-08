"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, Briefcase, Users, ArrowRight, Star, TrendingUp, Shield } from "lucide-react";
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
            <div className="lg:px-6 px-4 md:px-6">
                <section className="relative px-10 py-20 overflow-hidden bg-er-primary-dark container mx-auto rounded-3xl">
                    <Image src="/brand-assets/visual-assets/illustrations/hero-section.png" width={400} height={400} alt="hero-section" className="absolute object-cover inset-0 w-full h-full" unoptimized />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-er-primary/10 via-transparent to-transparent opacity-70" />
                    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-3 gap-12 items-center">
                            <div className="flex flex-col gap-6 text-center lg:text-left col-span-2 w-[75%]">
                                <h1 className="text-4xl primary-font md:text-5xl lg:text-6xl tracking-tight text-white leading-[100%]">
                                    Connecting<br />
                                    African Talent with Opportunity<span className="text-er-complimentary">.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-white max-w-2xl mx-auto lg:mx-0">
                                    The smartest recruitment platform connecting top talent and forward-thinking employers across Africa.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" className="h-12 px-8 text-base bg-er-primary-light hover:bg-er-primary-dark">
                                        <Link href="/auth/register?role=employer">Post a Job</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="px-8 text-base bg-er-secondary border-er-secondary-light hover:bg-er-secondary-light">
                                        <Link href="/jobs">Find Jobs</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Visual Mockup */}
                            <div className="relative mx-auto w-full">

                            </div>
                        </div>
                    </div>
                </section>
            </div>


            {/* Stats Section */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto lg:px-6 px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Job Seekers", value: "900+", icon: "/brand-assets/visual-assets/visual-icons/jobseekers.svg", color: "bg-er-primary" },
                            { label: "Employers", value: "3,200+", icon: "/brand-assets/visual-assets/visual-icons/employers.svg", color: "bg-er-secondary" },
                            { label: "Jobs Posted", value: "6,000+", icon: "/brand-assets/visual-assets/visual-icons/jobs-posted.svg", color: "bg-er-complimentary" },
                            { label: "Successful Hires", value: "4,500+", icon: "/brand-assets/visual-assets/visual-icons/successful-hires.svg", color: "bg-er-accent" },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-row gap-4 text-left rounded-xl transition-all duration-300 group">
                                <div className={`rounded-full transition-colors`}>
                                    <Image
                                        src={stat.icon}
                                        width={48}
                                        height={48}
                                        alt={stat.label}
                                        className="w-20 h-20"
                                    />
                                </div>
                                <div className="flex flex-col my-auto">
                                    <p className={`primary-font text-4xl font-semibold mb-0.5`}>{stat.value}</p>
                                    <p className="text-[11px] tracking-[0.4em] text-er-primary uppercase font-semibold dark:text-white/70">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 lg:py-10">
                <div className="max-w-7xl mx-auto lg:px-6 px-4 md:px-6">
                    <div className="grid lg:grid-cols-1 gap-16 items-center">


                        <div className="flex flex-col gap-8">
                            <div className="grid lg:grid-cols-2">
                                <SectionHeader
                                    sectionSubCaption="SYSTEM OVERVIEW"
                                    sectionTitle="Understand Our System and How to use it."
                                    align="left"
                                    titleClassName="dark:text-white"
                                    subCaptionClassName="dark:text-er-secondary"
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <FeatureCard
                                    image="/brand-assets/visual-assets/illustrations/how-it-work.png"
                                    title="Onboard Easily"
                                    featurelink="/auth/register"
                                    description="Easily sign up as an employer or job seeker in minutes."
                                />
                                <FeatureCard
                                    image="/brand-assets/visual-assets/illustrations/applying.jpg"
                                    title="Post or Apply"
                                    featurelink="/auth/login"
                                    description="Employers post jobs, candidates browse and apply."
                                />
                                <FeatureCard
                                    image="/brand-assets/visual-assets/illustrations/match-and-hire.png"
                                    title="Match & Hire"
                                    featurelink="/employer"
                                    description="Our smart system matches talent with the right opportunities."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Cards Section */}
            <section className="py-10 space-y-16">
                <div className="max-w-7xl lg:px-6 px-4 md:px-6 mx-auto">
                    <RoleCard
                        variant="jobseeker"
                        subTitle="For Jobseeker"
                        title="Explore & Find your Dream Job with Ease"
                        features={[
                            "Personalized job recommendations",
                            "Application tracking dashboard",
                            "Career development resources"
                        ]}
                        image="/brand-assets/visual-assets/illustrations/interview.jpg"
                    />
                </div>

                <div className="max-w-7xl mx-auto lg:px-6 px-4 md:px-6">
                    <RoleCard
                        variant="employer"
                        subTitle="For Employers"
                        title="Streamline Your Hiring Process with Ease"
                        features={[
                            "Smart applicant filtering",
                            "Real-time analytics & Notifications",
                            "Collaborative hiring tools for HR"
                        ]}
                        image="/brand-assets/visual-assets/illustrations/hiring.jpg"
                    />
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-6 bg-white overflow-hidden">
                <div className="max-w-7xl lg:px-6 px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <SectionHeader
                            sectionSubCaption="CLIENT STORIES"
                            sectionTitle="Driving success through smarter HR solutions"
                            align="center"
                            className="bg-white max-w-2xl mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                        <TestimonialCard
                            quote="EasyRecruit transformed how we hire. We found qualified candidates in half the time it usually takes."
                            author="DiveInSTEAM"
                            role="Gadfney Kennedy, CEO"
                            image="/brand-assets/partners-logos/diveinsteam-brandmark.svg"
                            isEmployer={true}
                        />
                        <TestimonialCard
                            quote="I landed my dream job within a week of creating my profile. The matching algorithm is spot on!"
                            author="David Chimwaza"
                            role="Software Engineer"
                            image="/brand-assets/visual-assets/illustrations/hero-section.png"
                            isEmployer={false}
                        />
                        <TestimonialCard
                            quote="EasyRecruit transformed how we hire. We found qualified candidates in half the time it usually takes"
                            author="AstroFX Enterprise"
                            role="Charity Mhango, Founder"
                            image="/brand-assets/partners-logos/astrofx-brandmark.svg"
                            isEmployer={true}
                        />
                    </div>
                </div>

                <PartnerSlide />

                <div className="flex justify-center gap-4 mt-10 pb-2">
                    <Button size="lg" variant="outline" className="text-base border-er-primary text-gray-900 hover:bg-er-primary/5 rounded-full">
                        <Link href="/feedback">Leave Feedback</Link>
                    </Button>
                    <Button size="lg" className="text-base bg-[#090033] hover:bg-[#090033]/90 text-white rounded-full">
                        <Link href="/case-studies">More Case Studies</Link>
                    </Button>
                </div>
            </section>

            {/* News & Updates Section */}
            <section className="py-4 bg-white">
                <div className="max-w-7xl lg:px-6 px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                        <div className="max-w-2xl">
                            <SectionHeader
                                sectionSubCaption="NEWS & TUTORIALS"
                                sectionTitle="News, Tutorials and Announcements"
                                align="left"
                                className="bg-white p-0"
                                titleClassName="text-4xl md:text-5xl"
                            />
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <Button size="lg" variant="outline" className="h-12 px-6 border-er-primary text-gray-900 rounded-full font-semibold">
                                <Link href="/system-updates">View System Updates</Link>
                            </Button>
                            <Button size="lg" className="h-12 px-6 bg-[#090033] hover:bg-[#090033]/90 text-white rounded-full font-semibold">
                                <Link href="/news">More News & Events</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ArticleCard
                            image="/brand-assets/visual-assets/illustrations/interview.jpg" // Placeholder
                            category="CAREER ADVISE"
                            categoryColorClass="bg-yellow-400"
                            readTime="5 Min Read time"
                            title="EasyRecruit New UI & Updates Changes for 2026"
                            date="18 Dec 2025"
                            type="Announcement"
                            link="/blog/new-ui-updates"
                        />
                        <ArticleCard
                            image="/brand-assets/visual-assets/illustrations/hero-section.png" // Placeholder
                            category="UPDATES"
                            categoryColorClass="bg-green-500 text-white"
                            readTime="5 Min Read time"
                            title="Interviews & Self assessment tests now live on EasyRecruit"
                            date="18 Dec 2025"
                            type="Announcement"
                            link="/blog/interviews-live"
                        />
                        <ArticleCard
                            image="/brand-assets/visual-assets/illustrations/applying.jpg" // Placeholder
                            category="CAREER ADVISE"
                            categoryColorClass="bg-yellow-400"
                            readTime="5 Min Read time"
                            title="How to Apply for jobs and get ready for Company Interviews"
                            date="18 Dec 2025"
                            type="Announcement"
                            link="/blog/how-to-apply"
                        />
                    </div>
                </div>
            </section>


        </div>
    );
}
