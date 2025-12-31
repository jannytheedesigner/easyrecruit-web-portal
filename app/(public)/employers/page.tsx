import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BarChart3, Users, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function EmployersPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-er-primary text-white hover:bg-er-primary mb-6 px-4 py-1.5 text-sm rounded-full pointer-events-none">
                        For Forward-Thinking Companies
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        Find the Right Talent, <span className="text-er-primary">Faster.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Transform your hiring process with our AI-powered recruitment platform. Post jobs, track applicants, and hire confidently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-er-primary hover:bg-er-primary-dark h-12 px-8 text-base">
                            <Link href="/auth/register?role=employer">Post a Job for Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 h-12 px-8 text-base">
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats / Trust */}
            <section className="py-10 bg-slate-800 border-b border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <div className="text-xl font-bold text-white">TECHFLOW</div>
                        <div className="text-xl font-bold text-white">GLOBAL BANK</div>
                        <div className="text-xl font-bold text-white">STARTUP INC</div>
                        <div className="text-xl font-bold text-white">AFRICA COMMS</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Hire</h2>
                        <p className="text-gray-600 text-lg">Powerful tools designed to make recruitment seamless and effective for teams of all sizes.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Users className="w-10 h-10 text-blue-500" />, title: "Applicant Tracking", desc: "Manage candidates through a visual pipeline. Drag and drop to move them through stages." },
                            { icon: <Zap className="w-10 h-10 text-yellow-500" />, title: "Smart Shortlisting", desc: "Our algorithm highlights the best candidates based on skills, experience, and match score." },
                            { icon: <MessageSquare className="w-10 h-10 text-green-500" />, title: "Integrated Messaging", desc: "Communicate with candidates directly from the platform. Schedule interviews effortlessly." },
                            { icon: <BarChart3 className="w-10 h-10 text-purple-500" />, title: "Hiring Analytics", desc: "Track your time-to-hire, source effectiveness, and other key metrics." },
                            { icon: <ShieldCheck className="w-10 h-10 text-red-500" />, title: "Verified Profiles", desc: "Access a pool of pre-vetted candidates with verified credentials and skill assessments." },
                            { icon: <CheckCircle2 className="w-10 h-10 text-er-primary" />, title: "Collaborative Hiring", desc: "Invite team members to review applications, leave notes, and make decisions together." },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                                <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Built for Every Organization</h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold mb-4">Startups</h3>
                            <p className="text-gray-600 mb-6">Move fast and hire your core team. Cost-effective plans for growing businesses.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free job postings</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic applicant tracking</li>
                            </ul>
                            <Button variant="outline" className="w-full">Get Started</Button>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md border border-er-primary/20 relative">
                            <div className="absolute top-0 right-0 bg-er-primary text-white text-xs px-3 py-1 rounded-bl-lg font-bold">POPULAR</div>
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold mb-4">SMEs</h3>
                            <p className="text-gray-600 mb-6">Scale your workforce efficiently with advanced tools and wider reach.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Priority support</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced analytics</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Candidate matching</li>
                            </ul>
                            <Button className="w-full bg-er-primary hover:bg-er-primary-dark">Create Account</Button>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold mb-4">Enterprises</h3>
                            <p className="text-gray-600 mb-6">Custom solutions for high-volume hiring and complex recruitment needs.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom integration</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated account manager</li>
                            </ul>
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Build Your Dream Team?</h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Join thousands of companies using EasyRecruit to hire the best talent in Africa.
                    </p>
                    <Button size="lg" className="h-12 px-10 text-lg bg-er-primary hover:bg-er-primary-dark shadow-lg shadow-er-primary/20">
                        <Link href="/auth/register?role=employer">Create Employer Account</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}
