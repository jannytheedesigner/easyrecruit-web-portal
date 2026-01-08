import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface FeatureCardProps {
    image: string;
    title: string;
    featurelink: string;
    description: string;
}

export const FeatureCard = ({ image, title, featurelink, description }: FeatureCardProps) => {
    return (
        <div className="relative overflow-hidden rounded-2xl group h-[300px]">
            {/* Image Background */}
            <div className="absolute inset-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t z-30 from-er-dark/90 via-er-dark/60 to-transparent dark:from-er-primary dark:via-er-primary/60 " />

            <div className="absolute inset-0 bg-black/20 z-20" />
            {/* Content */}
            <div className="relative h-full z-40 flex flex-col justify-end p-6 z-10 text-white">
                <h3 className="primary-font text-2xl font-medium mb-1">{title}</h3>
                <p className="text-white/90 text-lg leading-[120%] max-w-[90%]">
                    {description}
                </p>
                <Button className="mt-2 rounded-lg bg-er-primary-light text-er-white justify-between py-4 px-8 hover:bg-er-primary">
                    <Link href={featurelink} className="justify-between flex">
                        Get Started

                    </Link>
                    <MoveRight />
                </Button>
            </div>
        </div>
    );
};
