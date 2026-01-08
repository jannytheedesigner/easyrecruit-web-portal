"use client";

import Image from "next/image";

const PARTNERS = [
    { name: "Patkay Graphics", logo: "/brand-assets/partners-logos/patkay.png" },
    { name: "WithU Enterprise", logo: "/brand-assets/partners-logos/withu.png" },
    { name: "Klug Tech", logo: "/brand-assets/partners-logos/klugtech.png" },
    { name: "Investors Edge Africa", logo: "/brand-assets/partners-logos/investors-edge.png" },
    { name: "DiveInSTEAM", logo: "/brand-assets/partners-logos/diveinsteam.png" },
    { name: "AstroFX", logo: "/brand-assets/partners-logos/astrofx.png" },
    { name: "Elite Insurance", logo: "/brand-assets/partners-logos/elite-insurance.png" },
];

export const PartnerSlide = () => {
    // Duplicate the partners to create a seamless loop
    const sliders = [...PARTNERS, ...PARTNERS];

    return (
        <div className="border-er-primary/30 overflow-hidden bg-white py-10">
            <div className="relative mx-auto max-w-7xl">
                {/* Fade edges */}
                <div className="pointer-events-none hidden absolute lg:block top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none hidden absolute top-0 lg:block right-0 w-32 h-full z-10 bg-gradient-to-l from-white to-transparent" />

                <div className="overflow-hidden">
                    <div className="flex animate-slide space-x-12 items-center">
                        {sliders.map((partner, idx) => (
                            <div key={idx} className="relative h-20 w-48 shrink-0 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="object-contain max-h-16 w-auto"
                                    width={160}
                                    height={80}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <style jsx>{`
                @keyframes slide {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-slide {
                    animation: slide 40s linear infinite;
                    width: max-content;
                }
                .animate-slide:hover {
                    animation-play-state: paused;
                }
            `}</style>
            </div>
        </div>
    );
};
