import Image from "next/image";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface RoleCardProps {
    variant: 'jobseeker' | 'employer';
    title: string;
    subTitle: string;
    features: string[];
    image: string;
    titleColor?: string;
    subTitleColor?: string;
    pillColor?: string;
    textColor?: string;
    iconColor?: string;
}

export const RoleCard = ({
    variant,
    title,
    subTitle,
    features,
    image,
    titleColor,
    subTitleColor,
    pillColor,
    textColor,
    iconColor
}: RoleCardProps) => {
    const isJobSeeker = variant === 'jobseeker';

    return (
        <div className={cn(
            "rounded-3xl overflow-hidden relative flex items-center",
            isJobSeeker ? "text-gray-900 bg-er-secondary" : "text-white bg-er-primary"
        )}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={isJobSeeker
                        ? "/brand-assets/visual-assets/illustrations/jobseeker-bg.png"
                        : "/brand-assets/visual-assets/illustrations/employer-bg.png"
                    }
                    alt="Background"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <div className="container mx-auto px-6 md:px-16 py-16 relative z-10">
                <div className={cn(
                    "grid lg:grid-cols-2 gap-12 items-center",
                )}>
                    {/* Content Section */}
                    <div className={cn(
                        "flex flex-col gap-6 z-10",
                        isJobSeeker ? "order-1" : "order-2 lg:order-2"
                    )}>
                        <SectionHeader
                            sectionSubCaption={subTitle}
                            sectionTitle={title}
                            align="left"
                            titleClassName={cn(isJobSeeker ? "text-gray-900" : "text-white", titleColor)}
                            subCaptionClassName={cn(isJobSeeker ? "text-gray-900" : "text-er-secondary", subTitleColor)}
                            pillClassName={cn(isJobSeeker ? "bg-er-primary" : "bg-gray-900", pillColor)}
                        />

                        <ul className="flex flex-col gap-2 mt-2">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-4">
                                    <div className={cn(
                                        "min-w-12 min-h-12 rounded-sm flex items-center justify-center transition-colors",
                                        isJobSeeker ? "bg-white/20 hover:bg-white/40" : "bg-white/20 hover:bg-black/10",
                                        iconColor
                                    )}>
                                        <MoveRight className="w-4 h-4" />
                                    </div>
                                    <span className={cn("text-lg font-medium", textColor)}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Section */}
                    <div className={cn(
                        "relative h-full w-full rounded-2xl overflow-hidden mt-8 lg:mt-0",
                        isJobSeeker ? "order-2" : "order-1 lg:order-1"
                    )}>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
