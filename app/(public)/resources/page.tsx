import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, HelpCircle, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/easycomponents/SectionHeader";
import { ArticleCard } from "@/components/easycomponents/ArticleCard";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-background">
            {/* Header */}
            <section className="bg-gray-50 dark:bg-accent/5 py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <SectionHeader
                            sectionSubCaption="KNOWLEDGE HUB"
                            sectionTitle="Resources & Guides"
                            align="center"
                            titleClassName="dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0 max-w-2xl"
                        />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center mt-4">
                        Expert advice, industry insights, and helpful guides to supercharge your hiring or job search.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Blog */}
                    <Link href="/blog" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-border dark:bg-card">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-blue-600 transition-colors dark:text-white">Blog</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Latest news, trends, and success stories from the EasyRecruit team.</p>
                                <div className="flex items-center text-blue-600 font-medium">Read Articles <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Hiring Guides */}
                    <Link href="/guides" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-border dark:bg-card">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-green-600 transition-colors dark:text-white">Hiring Guides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Step-by-step playbooks for employers to find and hire the best talent.</p>
                                <div className="flex items-center text-green-600 font-medium">View Guides <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Help Center */}
                    <Link href="/help" className="block group">
                        <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-border dark:bg-card">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <CardTitle className="group-hover:text-purple-600 transition-colors dark:text-white">Help Center</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">FAQs, tutorials, and support to get the most out of our platform.</p>
                                <div className="flex items-center text-purple-600 font-medium">Get Help <ArrowRight className="w-4 h-4 ml-2" /></div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-20 bg-gray-50 border-t border-gray-100 dark:bg-background dark:border-border">
                <div className="container mx-auto px-4">
                    <div className="flex justify-start mb-10">
                        <SectionHeader
                            sectionSubCaption="TRENDING"
                            sectionTitle="Featured Articles"
                            align="left"
                            titleClassName="text-3xl dark:text-white"
                            subCaptionClassName="dark:text-er-secondary"
                            className="bg-transparent p-0"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Top 10 Soft Skills Employers Look For",
                                category: "CAREER ADVICE",
                                color: "bg-blue-400",
                                image: "/brand-assets/visual-assets/illustrations/interview.jpg",
                                link: "/blog/soft-skills"
                            },
                            {
                                title: "How to Negotiate Your Salary Like a Pro",
                                category: "GUIDES",
                                color: "bg-green-500",
                                image: "/brand-assets/visual-assets/illustrations/hiring.jpg",
                                link: "/blog/salary-negotiation"
                            },
                            {
                                title: "Remote Work Trends in Africa 2024",
                                category: "TRENDS",
                                color: "bg-purple-500",
                                image: "/brand-assets/visual-assets/illustrations/hero-section.png",
                                link: "/blog/remote-work"
                            }
                        ].map((article, i) => (
                            <ArticleCard
                                key={i}
                                title={article.title}
                                category={article.category}
                                categoryColorClass={article.color}
                                image={article.image}
                                link={article.link}
                                date="Oct 24, 2025"
                                readTime="5 Min Read"
                                type="Article"
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
