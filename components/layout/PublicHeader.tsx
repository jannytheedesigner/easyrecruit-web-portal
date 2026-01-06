"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "oxisverse-logo-system";
import { Button } from "@/components/easycomponents/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/", label: "Home" },
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

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 m-5 rounded-full bg-white",
                scrolled
                    ? "bg-er-accent py-4"
                    : "bg-er-accent py-4"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Logo
                            brandName="easyrecruit"
                            type="horizontal"
                            variant="main"
                            format="svg"
                            width={scrolled ? 130 : 135}
                            height={40}
                            alt="EasyRecruit Logo"
                            className="transition-all duration-300"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center space-x-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-er-primary",
                                    pathname === link.href
                                        ? "text-er-primary"
                                        : "text-gray-600"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden xl:flex items-center space-x-4">
                        <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-er-primary">
                            Login
                        </Link>
                        <Button
                            variant="primary"
                            size="lg"
                            className={cn(
                                "transition-all",
                                scrolled ? "h-9 px-4 text-sm" : "h-10 px-6"
                            )}
                        >
                            <Link href="/auth/register">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden p-2 text-gray-600 hover:text-gray-900"
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col space-y-4 animate-in slide-in-from-top-2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-base font-medium p-2 rounded-md hover:bg-gray-50",
                                pathname === link.href
                                    ? "text-er-primary bg-gray-50"
                                    : "text-gray-600"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                        <Link
                            href="/auth/login"
                            className="text-center font-semibold text-gray-700 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Button variant="primary" className="w-full">
                            <Link href="/auth/register" className="w-full h-full flex items-center justify-center">Get Started</Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
