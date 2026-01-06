"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Search, Briefcase, Users, ArrowRight, Star, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative px-10 py-26 overflow-hidden bg-er-primary-dark max-w-7xl mx-auto rounded-3xl">
                <Image src="/brand-assets/visual-assets/illustrations/hero-section.svg" width={400} height={400} alt="hero-section" className="absolute object-cover inset-0 w-full h-full" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-er-primary/10 via-transparent to-transparent opacity-70" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12 items-center">
                        <div className="flex flex-col gap-6 text-center lg:text-left col-span-2 w-[80%]">
                            <h1 className="text-4xl primary-font md:text-5xl lg:text-6xl tracking-tight text-white leading-[100%]">
                                Connecting Talents and Employers<span className="text-er-complimentary">.</span>
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

            {/* Stats Section */}
            <section className="py-12 border-y border-gray-100">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Job Seekers", value: "10,000+", icon: "/brand-assets/visual-assets/visual-icons/jobseekers.svg", color: "bg-er-primary" },
                            { label: "Employers", value: "1,200+", icon: "/brand-assets/visual-assets/visual-icons/employers.svg", color: "bg-er-secondary" },
                            { label: "Jobs Posted", value: "5,000+", icon: "/brand-assets/visual-assets/visual-icons/jobs-posted.svg", color: "bg-er-complimentary" },
                            { label: "Successful Hires", value: "8,500+", icon: "/brand-assets/visual-assets/visual-icons/successful-hires.svg", color: "bg-er-accent" },
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
                                    <p className="text-[11px] tracking-[0.4em] text-er-primary uppercase font-semibold">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 lg:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How EasyRecruit Works</h2>
                        <p className="text-lg text-gray-600">Simple, efficient, and reliable recruitment process for everyone.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Users className="w-8 h-8 text-er-primary" />, title: "Create Account", desc: "Sign up as an employer or job seeker in minutes." },
                            { icon: <Search className="w-8 h-8 text-er-primary" />, title: "Post or Apply", desc: "Employers post jobs, candidates browse and apply." },
                            { icon: <CheckCircle2 className="w-8 h-8 text-er-primary" />, title: "Match & Hire", desc: "Our smart system matches talent with the right opportunities." },
                        ].map((step, idx) => (
                            <Card key={idx} className="bg-white border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-er-primary/5 flex items-center justify-center mb-2">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Employers Preview */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            {/* Abstract Dashboard Visual */}
                            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-600 rounded"></div>
                                        <div className="h-8 w-48 bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="h-10 w-10 bg-er-primary rounded-lg flex items-center justify-center">
                                        <TrendingUp className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gray-600"></div>
                                                <div>
                                                    <div className="h-3 w-24 bg-gray-500 rounded mb-2"></div>
                                                    <div className="h-2 w-16 bg-gray-600 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-8 w-20 bg-gray-600 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-er-primary font-semibold tracking-wider text-sm uppercase mb-2 block">For Employers</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Streamline Your Hiring</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Stop sorting through endless emails. Our employer dashboard gives you powerful tools to track, filter, and manage applicants effortlessly.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Smart applicant filtering",
                                    "Real-time analytics",
                                    "Collaborative hiring tools"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-er-primary" />
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" className="bg-er-primary hover:bg-er-primary-dark border-none">
                                <Link href="/employers">Start Hiring Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Job Seekers Preview */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-er-primary font-semibold tracking-wider text-sm uppercase mb-2 block">For Job Seekers</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Find Your Dream Job</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Create a standout profile and let opportunities come to you. Track your applications and get notified when new jobs match your skills.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Personalized job recommendations",
                                    "Application tracking dashboard",
                                    "Career development resources"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-er-primary" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" variant="outline" className="border-er-primary text-er-primary hover:bg-er-primary/5">
                                <Link href="/jobs">Find Your Next Job</Link>
                            </Button>
                        </div>
                        <div className="relative">
                            {/* Abstract Profile Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-md mx-auto relative z-10">
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 border-4 border-white shadow-lg"></div>
                                    <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-5 w-16 bg-green-100 rounded-full"></div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-5 w-16 bg-blue-100 rounded-full"></div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Decor elements */}
                            <div className="absolute top-10 -right-4 w-20 h-20 bg-er-primary/10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trusted by Professionals</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-8">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic">
                                    "EasyRecruit transformed how we hire. We found qualified candidates in half the time it usually takes."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Sarah Johnson</p>
                                        <p className="text-sm text-gray-500">HR Manager, TechFlow</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md">
                            <CardContent className="p-8">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic">
                                    "I landed my dream job within a week of creating my profile. The matching algorithm is spot on!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900">David Chimwaza</p>
                                        <p className="text-sm text-gray-500">Software Engineer</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to transform your hiring?</h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
                        Join thousands of others who are already using EasyRecruit to build their future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="h-12 px-8 text-base bg-gray-900 hover:bg-gray-800">
                            <Link href="/auth/register?role=employer">Create Employer Account</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                            <Link href="/auth/register?role=jobseeker">Create Job Seeker Account</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
