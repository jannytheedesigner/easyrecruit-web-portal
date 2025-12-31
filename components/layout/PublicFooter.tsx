"use client";

import Link from "next/link";
import { Logo } from "oxisverse-logo-system";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 bg-white w-fit px-2 py-1 rounded">
                            <Logo
                                brandName="easyrecruit"
                                type="horizontal"
                                variant="main"
                                format="svg"
                                width={160}
                                height={36}
                                alt="EasyRecruit Logo"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Connecting Africa's top talent with leading employers.
                            The smartest way to hire and get hired.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Employers Column */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">Employers</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link href="/employers" className="hover:text-white transition-colors">About Solution</Link>
                            </li>
                            <li>
                                <Link href="/auth/register?role=employer" className="hover:text-white transition-colors">Post a Job</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-white transition-colors">Employer Dashboard</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Job Seekers Column */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">Job Seekers</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link>
                            </li>
                            <li>
                                <Link href="/auth/register?role=jobseeker" className="hover:text-white transition-colors">Create Profile</Link>
                            </li>
                            <li>
                                <Link href="/job-seekers" className="hover:text-white transition-colors">Career Resources</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">Resources</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-white transition-colors">Hiring Guides</Link>
                            </li>
                            <li>
                                <Link href="/resources/faq" className="hover:text-white transition-colors">FAQs</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} EasyRecruit. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
