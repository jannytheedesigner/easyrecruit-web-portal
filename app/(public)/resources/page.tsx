import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, HelpCircle, ArrowRight } from "lucide-react";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Resources & Guides</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Expert advice, industry insights, and helpful guides to supercharge your hiring or job search.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Blog */}
                    <Link href="/blog" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-blue-600 transition-colors">Blog</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">Latest news, trends, and success stories from the EasyRecruit team.</p>
                                <div className="flex items-center text-blue-600 font-medium">Read Articles <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Hiring Guides */}
                    <Link href="/guides" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-green-600 transition-colors">Hiring Guides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">Step-by-step playbooks for employers to find and hire the best talent.</p>
                                <div className="flex items-center text-green-600 font-medium">View Guides <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Help Center */}
                    <Link href="/help" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-purple-600 transition-colors">Help Center</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">FAQs, tutorials, and support to get the most out of our platform.</p>
                                <div className="flex items-center text-purple-600 font-medium">Get Help <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Top 10 Soft Skills Employers Look For",
                            "How to Negotiate Your Salary Like a Pro",
                            "Remote Work Trends in Africa 2024",
                            "Writing a Job Description that Converts"
                        ].map((title, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-blue-600 uppercase mb-2 block">Career Advice</span>
                                <h3 className="font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
                                <p className="text-sm text-gray-500">5 min read</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
