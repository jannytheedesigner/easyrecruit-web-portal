import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    image: string; // Logo for employer, Avatar for jobseeker
    isEmployer: boolean;
}

export const TestimonialCard = ({ quote, author, role, image, isEmployer }: TestimonialCardProps) => {
    return (
        <div className="relative bg-er-accent rounded-2xl overflow-hidden p-10 flex flex-col justify-between h-full">
            {/* Background Image */}
            <div className="absolute inset-0 z-10">
                <Image
                    src={"/brand-assets/visual-assets/illustrations/testimonial-bg.png"}
                    alt="Background"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            
            <div className="relative z-40">
                <p className="text-xl md:text-2xl text-gray-800 primary-font leading-[120%] mb-6">
                    {quote}
                </p>
                {/* Green underline divider */}
                <div className="h-0.5 w-32 bg-er-complimentary rounded-full mb-6"></div>
            </div>

            <div className="flex items-center gap-4 z-30 relative">
                <div className={cn(
                    "relative overflow-hidden shrink-0",
                    isEmployer ? "w-12 h-12 rounded-full bg-white p-1" : "w-14 h-14 rounded-full bg-gray-200"
                )}>
                    <Image
                        src={image}
                        alt={author}
                        fill
                        className="object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-gray-900 primary-font text-lg leading-tight">
                        {isEmployer ? author : author} {/* For employer, author is Company Name usually, but props say author. I'll rely on usage. */}
                    </h4>
                    <p className="text-er-primary-dark text-sm font-medium">
                        {role}
                    </p>
                </div>
            </div>
        </div>
    );
};
