
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Job } from "@/lib/services/job-service";

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="hover:border-er-primary/50 transition-colors dark:bg-card dark:border-border">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded bg-gray-100 dark:bg-muted flex items-center justify-center font-bold text-gray-500 dark:text-muted-foreground">
                            {job.company.charAt(0)}
                        </div>
                        <div>
                            <Link
                                href={`/jobs/${job.slug}`}
                                className="text-lg font-bold text-gray-900 dark:text-white hover:text-er-primary transition-colors"
                            >
                                {job.title}
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 dark:text-gray-400">
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
                        <Button className="w-full md:w-auto bg-er-primary hover:bg-er-primary-dark">
                            Apply Now
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
