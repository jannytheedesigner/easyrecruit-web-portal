"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobService, Job } from "@/lib/services/job-service";
import { JobCard } from "@/components/jobs/JobCard";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                if (category) {
                    // Decode the category in case it has URL encoded characters
                    const decodedCategory = decodeURIComponent(category);
                    const data = await JobService.getJobs({ category: decodedCategory });
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [category]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/jobs" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                {category ? decodeURIComponent(category).replace(/-/g, " ") : "Category"} Jobs
                            </h1>
                            <p className="text-gray-500">
                                Browse all open positions in {category ? decodeURIComponent(category).replace(/-/g, " ") : "this category"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-er-primary"></div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">{jobs.length} jobs found</p>
                        </div>

                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}

                            {jobs.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                                    <p className="text-gray-500 mt-2">
                                        We couldn't find any jobs matching "{decodeURIComponent(category)}".
                                    </p>
                                    <Button variant="outline" className="mt-4" asChild>
                                        <Link href="/jobs">View All Jobs</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
