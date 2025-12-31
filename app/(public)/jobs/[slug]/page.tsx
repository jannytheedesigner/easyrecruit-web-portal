import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Briefcase, DollarSign, Clock, Globe, ArrowLeft, Share2, Bookmark } from "lucide-react";

export default function JobDetailsPage({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Breadcrumb / Back */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/jobs" className="flex items-center text-sm text-gray-600 hover:text-er-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Job Header Card */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 flex-shrink-0">
                                    T
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Senior Frontend Developer</h1>
                                    <div className="flex items-center gap-2 text-lg text-gray-700 mb-4">
                                        TechFlow Solutions
                                        <Link href="#" className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">Verified</Link>
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-6">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Lilongwe, Malawi</span>
                                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Full-time</span>
                                        <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> MK 1.5M - 2.0M</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted 2 days ago</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button size="lg" className="bg-er-primary hover:bg-er-primary-dark sm:w-auto w-full">Apply Now</Button>
                                        <Button variant="outline" size="lg" className="sm:w-auto w-full">
                                            <Bookmark className="w-4 h-4 mr-2" /> Save Job
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Job Description</h2>
                            <div className="prose max-w-none text-gray-600 space-y-4">
                                <p>
                                    We are looking for an experienced Senior Frontend Developer to join our dynamic team using modern web technologies. You will be responsible for building high-quality, responsive web applications that provide an exceptional user experience.
                                </p>
                                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Key Responsibilities</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Develop and maintain responsive web applications using React, Next.js, and TypeScript.</li>
                                    <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                                    <li>Optimize applications for maximum speed and scalability.</li>
                                    <li>Ensure the technical feasibility of UI/UX designs.</li>
                                    <li>Mentor junior developers and conduct code reviews.</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>5+ years of experience in frontend development.</li>
                                    <li>Strong proficiency in JavaScript, TypeScript, HTML, and CSS.</li>
                                    <li>Experience with React.js and Next.js frameworks.</li>
                                    <li>Familiarity with state management libraries (e.g., Redux, Zustand).</li>
                                    <li>Understanding of RESTful APIs and GraphQL.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Employer Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About the Employer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500">T</div>
                                    <div>
                                        <p className="font-bold text-gray-900">TechFlow Solutions</p>
                                        <p className="text-xs text-gray-500">Information Technology</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Leading software development company in Malawi specializing in enterprise solutions and digital transformation.
                                </p>
                                <div className="pt-4 border-t border-gray-100">
                                    <Link href="#" className="flex items-center text-sm text-er-primary hover:underline">
                                        <Globe className="w-4 h-4 mr-2" /> Visit Website
                                    </Link>
                                </div>
                                <Button variant="outline" className="w-full">View Company Profile</Button>
                            </CardContent>
                        </Card>

                        {/* Similar Jobs */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Similar Jobs</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Link key={i} href="#" className="block group">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-er-primary transition-colors">UI/UX Designer</h4>
                                        <p className="text-sm text-gray-500">Creative Studio • Blantyre</p>
                                        <p className="text-xs text-gray-400 mt-1">Posted 1 day ago</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Share this Job</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                                <Button variant="outline" className="flex-1">Copy Link</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
