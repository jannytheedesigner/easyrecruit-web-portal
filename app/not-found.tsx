"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/easycomponents/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicHeader />

            <main className="flex-grow flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-er-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-er-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="max-w-3xl w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image src="/brand-assets/icon-assets/other-icons/404-error.svg" alt="404 Error" width={500} height={500} className="mx-auto w-[90em]" />

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/">
                                <Button variant="primary" size="lg" className="group py-4 bg-er-primary-dark">
                                    <Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                                    Back to Home
                                </Button>
                            </Link>

                            <Link href="/jobs">
                                <Button variant="outlinePrimary" size="lg" className="py-4 group border-2 border-er-primary/20 hover:border-er-primary text-er-primary">
                                    <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                    Explore Jobs
                                </Button>
                            </Link>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mt-16"
                        >
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center text-gray-500 hover:text-er-primary transition-colors text-sm font-medium group"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Go back to previous page
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Illustration/Graphic placeholder (using CSS shapes/gradients for premium feel) */}
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-er-primary" />
                        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="text-er-secondary" />
                        <path d="M200 20L220 180L380 200L220 220L200 380L180 220L20 200L180 180L200 20Z" fill="currentColor" className="text-er-primary/20" />
                    </svg>
                </div>
            </main>
        </div>
    );
}
