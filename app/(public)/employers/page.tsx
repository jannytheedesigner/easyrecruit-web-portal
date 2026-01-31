import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BarChart3, Users, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { EmployerHero } from "@/components/easycomponents/forEmployer/EmployerHero";
import { PartnerSlide } from "@/components/easycomponents/PartnerSlide";
import { SectionHeader } from "@/components/easycomponents/SectionHeader";
import { TestimonialCard } from "@/components/easycomponents/TestimonialCard";

export default function EmployersPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <EmployerHero
                caption="For Forward-Thinking Companies"
                title="Find the Right Talent, Easier & Faster"
                subtitle="Transform your hiring process with our AI-powered recruitment platform. Post jobs, track applicants, and hire confidently."

            />

            <div className="dark:hidden relative z-40">
                <PartnerSlide />
            </div>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mb-16">
                        <SectionHeader
                            sectionSubCaption="KEY FEATURES"
                            sectionTitle="Everything You Need to Hire Top Talent"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-white dark:bg-background p-0 max-w-3xl"
                        />
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
                            <div key={idx} className="p-8 rounded-2xl bg-gray-50 dark:bg-accent/10 hover:bg-white dark:hover:bg-accent/20 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 group">
                                <div className="bg-white dark:bg-accent/20 w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50 dark:bg-accent/5">
                <div className="container lg:px-0 px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <SectionHeader
                            sectionSubCaption="SUCCESS STORIES"
                            sectionTitle="Companies that trust EasyRecruit"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0 max-w-2xl mx-auto"
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
                            quote="The quality of candidates on this platform is unmatched. It's become our go-to recruitment tool."
                            author="TechCorp Solutions"
                            role="Sarah Jenkins, HR Director"
                            image="/brand-assets/partners-logos/astrofx-brandmark.svg" // Using existing as placeholder if needed, or generic
                            isEmployer={true}
                        />
                        <TestimonialCard
                            quote="Simple, efficient, and effective. The collaborative features saved our team hours of coordination."
                            author="AstroFX Enterprise"
                            role="Charity Mhango, Founder"
                            image="/brand-assets/partners-logos/astrofx-brandmark.svg"
                            isEmployer={true}
                        />
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mb-16">
                        <SectionHeader
                            sectionSubCaption="SOLUTIONS"
                            sectionTitle="Built for Every Organization"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0 max-w-3xl"
                        />
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-sm border border-gray-100 dark:border-border hover:shadow-md transition-all">
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold dark:text-white mb-4">Startups</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Move fast and hire your core team. Cost-effective plans for growing businesses.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free job postings</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic applicant tracking</li>
                            </ul>
                            <Button variant="outline" className="w-full">Get Started</Button>
                        </div>
                        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-md border border-er-primary/20 dark:border-er-primary/20 relative scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-er-primary text-white text-xs px-3 py-1 rounded-bl-lg font-bold">POPULAR</div>
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold dark:text-white mb-4">SMEs</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Scale your workforce efficiently with advanced tools and wider reach.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Priority support</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced analytics</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Candidate matching</li>
                            </ul>
                            <Button className="w-full bg-er-primary hover:bg-er-primary-dark">Create Account</Button>
                        </div>
                        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-sm border border-gray-100 dark:border-border hover:shadow-md transition-all">
                            <div className="h-1 w-12 bg-er-primary mb-6"></div>
                            <h3 className="text-2xl font-bold dark:text-white mb-4">Enterprises</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Custom solutions for high-volume hiring and complex recruitment needs.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom integration</li>
                                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated account manager</li>
                            </ul>
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gray-50 dark:bg-background border-t border-gray-100 dark:border-gray-800 text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-6">Ready to Build Your Dream Team?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
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
