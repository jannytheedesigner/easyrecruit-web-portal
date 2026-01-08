"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Filter, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { JobService, Job } from "@/lib/services/job-service";
import { JobCard } from "@/components/jobs/JobCard";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await JobService.getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-20">
            {/* Search Header */}
            <div className="bg-white dark:bg-background border-b border-gray-200 dark:border-border sticky top-16 z-30">
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
                        <div className="bg-white dark:bg-card p-6 rounded-lg border border-gray-200 dark:border-border shadow-sm">
                            <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                                <Filter className="w-4 h-4" />
                                Filters
                            </div>

                            {/* Job Type */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3 dark:text-gray-200">Job Type</h3>
                                <div className="space-y-2">
                                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox id={`type-${type}`} />
                                            <Label htmlFor={`type-${type}`} className="text-sm text-gray-600 dark:text-gray-400 font-normal">{type}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3 dark:text-gray-200">Experience Level</h3>
                                <div className="space-y-2">
                                    {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                                        <div key={level} className="flex items-center space-x-2">
                                            <Checkbox id={`level-${level}`} />
                                            <Label htmlFor={`level-${level}`} className="text-sm text-gray-600 dark:text-gray-400 font-normal">{level}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Remote / Onsite */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3 dark:text-gray-200">Workplace</h3>
                                <div className="space-y-2">
                                    {["On-site", "Remote", "Hybrid"].map((place) => (
                                        <div key={place} className="flex items-center space-x-2">
                                            <Checkbox id={`place-${place}`} />
                                            <Label htmlFor={`place-${place}`} className="text-sm text-gray-600 dark:text-gray-400 font-normal">{place}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Jobs <span className="text-gray-500 dark:text-gray-400 font-normal text-base ml-2">({jobs.length} results)</span></h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
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

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-er-primary"></div>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {jobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                                {jobs.length === 0 && (
                                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                        No jobs found.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex justify-center">
                            <Button variant="outline" className="w-full md:w-auto">Load More Jobs</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
