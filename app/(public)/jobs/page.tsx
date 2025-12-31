"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Filter, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock Data
const MOCK_JOBS = [
    {
        id: 1,
        slug: "senior-frontend-developer",
        title: "Senior Frontend Developer",
        company: "TechFlow Solutions",
        location: "Lilongwe, Malawi",
        type: "Full-time",
        salary: "MK 1,500,000 - 2,000,000",
        posted: "2 days ago",
        tags: ["Remote", "React", "TypeScript"]
    },
    {
        id: 2,
        slug: "product-designer",
        title: "Product Designer",
        company: "Creative Studio",
        location: "Blantyre, Malawi",
        type: "Contract",
        salary: "MK 800,000 - 1,200,000",
        posted: "5 hours ago",
        tags: ["On-site", "Figma", "UI/UX"]
    },
    {
        id: 3,
        slug: "marketing-manager",
        title: "Marketing Manager",
        company: "Growth Inc.",
        location: "Lilongwe, Malawi",
        type: "Full-time",
        salary: "MK 1,200,000 - 1,800,000",
        posted: "1 week ago",
        tags: ["Hybrid", "SEO", "Strategy"]
    },
    {
        id: 4,
        slug: "backend-engineer",
        title: "Backend Engineer",
        company: "FinTech Africa",
        location: "Remote",
        type: "Full-time",
        salary: "USD 2,000 - 3,500",
        posted: "3 days ago",
        tags: ["Remote", "Node.js", "PostgreSQL"]
    },
];

export default function JobsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input placeholder="Job title, keywords, or company" className="pl-10 h-11" />
                        </div>
                        <div className="w-full md:w-64 relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input placeholder="City or Country" className="pl-10 h-11" />
                        </div>
                        <Button size="lg" className="bg-er-primary hover:bg-er-primary-dark h-11 px-8">
                            Search Jobs
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                                <Filter className="w-4 h-4" />
                                Filters
                            </div>

                            {/* Job Type */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Job Type</h3>
                                <div className="space-y-2">
                                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox id={`type-${type}`} />
                                            <Label htmlFor={`type-${type}`} className="text-sm text-gray-600 font-normal">{type}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Experience Level</h3>
                                <div className="space-y-2">
                                    {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                                        <div key={level} className="flex items-center space-x-2">
                                            <Checkbox id={`level-${level}`} />
                                            <Label htmlFor={`level-${level}`} className="text-sm text-gray-600 font-normal">{level}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Remote / Onsite */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3">Workplace</h3>
                                <div className="space-y-2">
                                    {["On-site", "Remote", "Hybrid"].map((place) => (
                                        <div key={place} className="flex items-center space-x-2">
                                            <Checkbox id={`place-${place}`} />
                                            <Label htmlFor={`place-${place}`} className="text-sm text-gray-600 font-normal">{place}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recommended Jobs <span className="text-gray-500 font-normal text-base ml-2">(45 results)</span></h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <Select defaultValue="newest">
                                    <SelectTrigger className="w-[140px] h-9">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="relevant">Relevance</SelectItem>
                                        <SelectItem value="salary">Salary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {MOCK_JOBS.map((job) => (
                                <Card key={job.id} className="hover:border-er-primary/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                                    {job.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/jobs/${job.slug}`} className="text-lg font-bold text-gray-900 hover:text-er-primary transition-colors">
                                                        {job.title}
                                                    </Link>
                                                    <p className="text-gray-600 mb-2">{job.company}</p>
                                                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" /> {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" /> {job.type}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="w-4 h-4" /> {job.salary}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" /> {job.posted}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 items-end">
                                                <Button className="w-full md:w-auto bg-er-primary hover:bg-er-primary-dark">Apply Now</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Button variant="outline" className="w-full md:w-auto">Load More Jobs</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
