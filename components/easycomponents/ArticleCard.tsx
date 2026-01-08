import Image from "next/image";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
    image: string;
    category: string;
    categoryColorClass: string; // e.g. "bg-yellow-400"
    readTime: string; // e.g. "5 Min Read time"
    title: string;
    date: string;
    type: string; // e.g. "Announcement"
    link: string;
}

export const ArticleCard = ({
    image,
    category,
    categoryColorClass,
    readTime,
    title,
    date,
    type,
    link
}: ArticleCardProps) => {
    return (
        <div className="bg-er-accent relative rounded-2xl overflow-hidden flex flex-col h-full group">
            {/* Background Image */}
            <div className="absolute inset-0 z-10">
                <Image
                    src={"/brand-assets/visual-assets/illustrations/article-bg.png"}
                    alt="Background"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Image Header with Overlays */}
            <div className="relative h-64 mt-6 mx-6 z-30 rounded-md overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlays positioned at the bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-end gap-2 items-end">
                    {/* Category Pill */}
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs uppercase tracking-wide primary-font text-gray-900",
                        categoryColorClass
                    )}>
                        {category}
                    </span>

                    {/* Read Time Pill */}
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-gray-800">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="primary-font">{readTime}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow relative z-40">
                <h3 className="text-2xl primary-font text-gray-900 leading-tight mb-6 flex-grow">
                    {title}
                </h3>

                {/* Divider */}
                <div className="h-px w-full bg-gray-300 mb-6"></div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-gray-600 bg-white py-2 pl-2 pr-3 rounded-sm">
                            <div className="bg-er-primary rounded p-1">
                                <Calendar className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium">{date}</span>
                        </div>

                        {/* Type */}
                        <div className="flex items-center gap-2 text-gray-600 bg-white py-2 pl-2 pr-3 rounded-sm hidden md:flex">
                            <div className="bg-er-primary rounded p-1">
                                <FileText className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium">{type}</span>
                        </div>
                    </div>

                    <Button asChild size="sm" className="bg-er-primary hover:bg-er-primary-dark text-white text-xs px-4 rounded-lg h-9">
                        <Link href={link}>
                            Continue
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
