"use client";

import Link from "next/link";
import { Logo } from "oxisverse-logo-system";
import { Facebook, Linkedin, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function PublicFooter() {
    return (
        <div className="flex flex-col bg-er-dark dark:bg-er-primary p-14 rounded-4xl overflow-hidden container mx-auto mb-10">
            {/* Integrated CTA Section - Overlaps the footer */}
            <div className="relative z-10">
                <div className="bg-er-complimentary dark:bg-er-secondary rounded-2xl p-12 md:p-16 relative overflow-hidden">
                    {/* Background Pattern - Abstract circles based on design */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full border-[60px] border-black/5 opacity-50"></div>
                        <div className="absolute top-0 -right-0 w-[400px] h-[400px] rounded-full border-[60px] border-black/5 opacity-50"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-3 rounded-full bg-er-complimentary flex items-center p-0.5 dark:bg-er-primary">
                                <div className="w-4 h-2 bg-er-secondary rounded-full"></div>
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-[#090033]">Be part of the future</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-medium primary-font dark:text-er-dark text-white mb-6 leading-[100%]">
                            Join thousands of others who are already using EasyRecruit to build their future<span className="text-er-primary">.</span>
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            <Button className="border-er-primary text-white rounded-full text-base dark:text-white">
                                <Link href="/feedback">Free Jobs Applications</Link>
                            </Button>
                            <Button variant="ghost" className="bg-er-dark hover:bg-er-dark/90 text-white rounded-full text-base">
                                {/* The design shows a dark button for "More Case Studies" too, possibly same style or transparent bg with border? 
                                    Image shows "More Case Studies" button looking similar to "Leave Feedback" but maybe slightly different shade or border.
                                    I'll use the same dark style as it looks good on the green.
                                */}
                                <Link href="/case-studies">Free CV Builder</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <footer className="text-white pt-20 pb-2">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-10 border-b border-gray-800 pb-16">

                        {/* Logo Badge Column */}
                        <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
                            <div className="relative w-48 h-48 dark:hidden">
                                <Logo
                                    brandName="easyrecruit"
                                    type="badge" // Using badge type as per request
                                    variant="dark"
                                    format="svg"
                                    width={200}
                                    height={200}
                                    alt="EasyRecruit Badge"
                                />
                            </div>
                            <div className="relative w-48 h-48 dark:block hidden">
                                <Logo
                                    brandName="easyrecruit"
                                    type="badge" // Using badge type as per request
                                    variant="primary"
                                    format="svg"
                                    width={200}
                                    height={200}
                                    alt="EasyRecruit Badge"
                                />
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {/* Product */}
                            <div>
                                <h3 className="text-xs font-medium primary-font tracking-widest text-gray-400 uppercase mb-6 pb-4 border-b border-gray-800 w-fit dark:text-er-secondary">Product</h3>
                                <ul className="space-y-4">
                                    <li><Link href="/roadmap" className="text-gray-300 hover:text-white transition-colors">Roadmap</Link></li>
                                    <li><Link href="/api-docs" className="text-gray-300 hover:text-white transition-colors">API Documentation</Link></li>
                                    <li><Link href="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="text-xs font-medium primary-font tracking-widest text-gray-400 uppercase mb-6 pb-4 border-b border-gray-800 w-fit dark:text-er-secondary">Company</h3>
                                <ul className="space-y-4">
                                    <li><Link href="/manifesto" className="text-gray-300 hover:text-white transition-colors">Our Manifesto</Link></li>
                                    <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Founders</Link></li>
                                    <li><Link href="/why-africa" className="text-gray-300 hover:text-white transition-colors">Why Africa?</Link></li>
                                </ul>
                            </div>

                            {/* Keep Quick Links as useful fallback or remove? User didn't specify a 3rd column, but layout expects 3 columns usually. 
                                 I'll replace the 3rd column with "Socials" or keep it empty/Contact if I have extra space.
                                 Actually, user request was "7. Footer Quick-Links... Product... Company...". 
                                 It implies specific links. I will leave the 3rd column blank or maybe "Legal" if standard, but to be safe and clean I will remove the 3rd column logic or just stick to the 2 specified groups? 
                                 The grid is `grid-cols-1 sm:grid-cols-3`. I'll use 2 and maybe spacer. 
                                 Actually, Resources is good to keep maybe? No, strict adherence.
                                 I will just implement Product and Company in the grid.
                             */}
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white gap-6">
                        <p className="text-xs uppercase font-medium primary-font tracking-[0.15em] text-white/60">EasyRecruit Africa 2026. An OXISVERSE Designed.</p>

                        <div className="flex items-center gap-4">
                            <span className="text-sm mr-2">Social Media Platforms</span>
                            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white">
                                <Youtube className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white">
                                <Send className="w-4 h-4 -rotate-45 ml-0.5 mt-0.5" /> {/* Telegramish */}
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white">
                                <Facebook className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
