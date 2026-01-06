import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-lg text-gray-600">Start for free and scale as you grow. No hidden fees.</p>
                </div>

                {/* Pricing Tabs */}
                <Tabs defaultValue="employers" className="w-full max-w-5xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="grid w-fit grid-cols-2">
                            <TabsTrigger value="employers">For Employers</TabsTrigger>
                            <TabsTrigger value="jobseekers">For Job Seekers</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="employers">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Free Plan */}
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-xl">Free</CardTitle>
                                    <CardDescription>Perfect for testing the waters</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">MK 0</span><span className="text-gray-500">/mo</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 1 Active Job Post</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Basic Applicant Tracking</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 7 days visibility</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full"><Link href="/auth/register?role=employer">Get Started</Link></Button>
                                </CardFooter>
                            </Card>

                            {/* Starter Plan */}
                            <Card className="border-er-primary shadow-lg scale-105 relative z-10">
                                <div className="absolute top-0 right-0 bg-er-primary text-white text-xs px-2 py-1 rounded-bl-lg font-bold">POPULAR</div>
                                <CardHeader>
                                    <CardTitle className="text-xl text-er-primary">Starter</CardTitle>
                                    <CardDescription>For growing businesses</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">MK 50,000</span><span className="text-gray-500">/mo</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> 5 Active Job Posts</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> 30 days visibility</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Social Media Sharing</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Basic Candidate Filtering</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-er-primary hover:bg-er-primary-dark"><Link href="/auth/register?role=employer">Choose Starter</Link></Button>
                                </CardFooter>
                            </Card>

                            {/* Pro Plan */}
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-xl">Pro</CardTitle>
                                    <CardDescription>For serious hiring needs</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">MK 150,000</span><span className="text-gray-500">/mo</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 15 Active Job Posts</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 60 days visibility</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Featured Job spots</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced Candidate Matching</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full"><Link href="/auth/register?role=employer">Choose Pro</Link></Button>
                                </CardFooter>
                            </Card>

                            {/* Enterprise Plan */}
                            <Card className="border-gray-200 bg-gray-50">
                                <CardHeader>
                                    <CardTitle className="text-xl">Enterprise</CardTitle>
                                    <CardDescription>Custom high-volume solution</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">Custom</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> Unlimited Job Posts</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> Dedicated Account Manager</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> API Access</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> Custom Branding</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full"><Link href="/contact">Contact Sales</Link></Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="jobseekers">
                        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            <Card className="border-er-primary shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-er-primary">Standard Profile</CardTitle>
                                    <CardDescription>Everything you need to get hired</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">MWK5000</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Create Professional Profile</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Apply to Unlimited Jobs</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Job Alerts</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-er-primary" /> Basic Skill Tests</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-er-primary hover:bg-er-primary-dark"><Link href="/auth/register?role=jobseeker">Create Free Account</Link></Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-gray-200">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl">Premium</CardTitle>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
                                    </div>
                                    <CardDescription>Stand out from the crowd</CardDescription>
                                    <div className="mt-4"><span className="text-3xl font-bold">MK 14,000</span><span className="text-gray-500">/mo</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm text-gray-500">
                                        <li className="flex gap-2"><Check className="w-4 h-4" /> Profile Highlighting</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4" /> Application Insights</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4" /> Direct Messaging</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button disabled variant="outline" className="w-full">Join Waitlist</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto mt-24">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {[
                            { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period." },
                            { q: "How do I pay?", a: "We accept all major credit cards, PayPal, and mobile money payments." },
                            { q: "Is there a free trial for paid plans?", a: "We offer a 14-day free trial for the Pro plan so you can experience the full power of EasyRecruit." },
                            { q: "What happens to my data if I downgrade?", a: "Your data remains safe. You will simply lose access to the premium features associated with your previous plan." }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger>{faq.q}</AccordionTrigger>
                                <AccordionContent>{faq.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
