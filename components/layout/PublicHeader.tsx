"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "oxisverse-logo-system";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/employers", label: "For Employers" },
    { href: "/job-seekers", label: "For Job Seekers" },
    { href: "/jobs", label: "Jobs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About" },
];

export function PublicHeader() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50 px-3 py-3 sm:px-6 lg:px-8">
            <div className={cn(
                "mx-auto flex max-w-7xl items-center justify-between rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 shadow-[0_20px_45px_-24px_rgba(13,33,161,0.35)] backdrop-blur-xl transition-all duration-300 sm:px-4",
                scrolled ? "py-2" : "py-3"
            )}>
                <Link href="/" className="flex-shrink-0">
                    <Logo
                        brandName="easyrecruit"
                        type="horizontal"
                        variant="main"
                        format="svg"
                        width={scrolled ? 120 : 132}
                        height={36}
                        alt="EasyRecruit Logo"
                        className="transition-all duration-300"
                        priority
                    />
                </Link>

                <nav className="hidden items-center gap-2 xl:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "er-nav-pill text-sm",
                                pathname === link.href
                                    ? "active"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-er-primary"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 xl:flex">
                    <Link href="/auth/login" className="text-sm font-semibold text-slate-700 transition hover:text-er-primary">
                        Login
                    </Link>
                    <Link href="/auth/register" className="rounded-full bg-er-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-er-primary/20 transition hover:bg-er-primary-dark">
                        Get Started
                    </Link>
                </div>

                <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 xl:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_45px_-24px_rgba(13,33,161,0.35)] backdrop-blur-xl xl:hidden">
                    <div className="flex flex-col gap-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "rounded-2xl px-3 py-3 text-base font-medium",
                                    pathname === link.href
                                        ? "bg-er-primary/10 text-er-primary"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                        <Link href="/auth/login" className="rounded-2xl px-3 py-3 text-center font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                            Login
                        </Link>
                        <Link href="/auth/register" className="rounded-full bg-er-primary px-4 py-3 text-center text-sm font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
