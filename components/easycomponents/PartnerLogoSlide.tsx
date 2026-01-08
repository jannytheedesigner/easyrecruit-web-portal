import Image from "next/image";
import Link from "next/link";

type Partner = {
    name: string;
    logo: string;
    href?: string;
};

const PARTNERS: Partner[] = [
    { name: "Patkay Graphics", logo: "/brand-assets/partners-logos/patkay.png" },
    { name: "WithU Enterprise", logo: "/brand-assets/partners-logos/withu.png" },
    { name: "Klug Tech", logo: "/brand-assets/partners-logos/klugtech.png" },
    { name: "Investors Edge Africa", logo: "/brand-assets/partners-logos/investors-edge.png" },
    { name: "DiveInSTEAM", logo: "/brand-assets/partners-logos/diveinsteam.png" },
    { name: "AstroFX", logo: "/brand-assets/partners-logos/astrofx.png" },
    { name: "Elite Insurance", logo: "/brand-assets/partners-logos/elite-insurance.png" },
];

export default function PartnerLogoSlide() {
    return (
        <section className="relative w-full overflow-hidden py-8">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

            <div className="flex w-max animate-logo-slide gap-14">
                {/* First set */}
                {PARTNERS.map((partner, index) => (
                    <PartnerLogo key={`partner-1-${index}`} partner={partner} />
                ))}

                {/* Duplicate set for infinite loop */}
                {PARTNERS.map((partner, index) => (
                    <PartnerLogo key={`partner-2-${index}`} partner={partner} />
                ))}
            </div>
        </section>
    );
}

function PartnerLogo({ partner }: { partner: Partner }) {
    const content = (
        <div className="flex min-w-[160px] items-center justify-center">
            <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={64}
                className="h-12 w-auto object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                priority={false}
            />
        </div>
    );

    if (partner.href) {
        return (
            <Link
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.name}
            >
                {content}
            </Link>
        );
    }

    return content;
}
