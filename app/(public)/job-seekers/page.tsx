import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, FileText, Bell, TrendingUp, CheckCircle2 } from "lucide-react";
import { JobseekerHero } from "@/components/easycomponents/forJobseeker/JobseekerHero";

export default function JobSeekersPage() {
    return (
        <div className="flex flex-col min-h-screen">

            <JobseekerHero
                caption="For Forward-Thinking Jobseekers"
                title="Your Career, One Opportunity Away"
                subtitle="Create your profile, get matched with top companies, and advance your career with EasyRecruit."
            />


            {/* Features */}
            <section className="py-24 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <FileText className="w-8 h-8 text-blue-600" />, title: "Smart Profile Builder", desc: "Showcase your skills, experience, and portfolio in a way that stands out to employers." },
                            { icon: <TrendingUp className="w-8 h-8 text-green-600" />, title: "Job Recommendations", desc: "Our AI matches you with jobs that fit your profile and career goals." },
                            { icon: <Bell className="w-8 h-8 text-yellow-600" />, title: "Instant Alerts", desc: "Get notified immediately when new jobs matching your criteria are posted." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-accent/10 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center hover:bg-blue-50/50 dark:hover:bg-accent/20 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-white dark:bg-accent/20 rounded-full shadow-sm flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Tools Preview */}
            <section className="py-24 bg-gray-50 dark:bg-background/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">More Than Just a Job Board</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                We provide the tools you need to succeed in your job search and career growth.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    "Professional CV templates and tips",
                                    "Interview preparation guides",
                                    "Salary insights and market trends",
                                    "Career advice articles"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4 bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm h-48 flex flex-col justify-end">
                                    <p className="font-bold text-xl mb-1 dark:text-white">CV Review</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Get expert feedback</p>
                                </div>
                                <div className="bg-blue-600 p-6 rounded-xl shadow-sm h-48 flex flex-col justify-end text-white mt-8">
                                    <p className="font-bold text-xl mb-1">Salary Calc</p>
                                    <p className="text-sm text-blue-100">Know your worth</p>
                                </div>
                                <div className="bg-indigo-900 p-6 rounded-xl shadow-sm h-48 flex flex-col justify-end text-white">
                                    <p className="font-bold text-xl mb-1">Interview Prep</p>
                                    <p className="text-sm text-indigo-200">Ace your meetings</p>
                                </div>
                                <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm h-48 flex flex-col justify-end mt-8">
                                    <p className="font-bold text-xl mb-1 dark:text-white">Community</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Connect with peers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Start Your Journey Today</h2>
                    <p className="text-blue-100 mb-10 max-w-xl mx-auto">Create a profile in minutes and let opportunities find you.</p>
                    <Button size="lg" className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold">
                        <Link href="/auth/register?role=jobseeker">Join EasyRecruit for Free</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
