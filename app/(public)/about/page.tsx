import { Logo } from "oxisverse-logo-system";
import { Users, Award, Heart, Globe } from "lucide-react";
import { AboutHero } from "@/components/easycomponents/about/AboutHero";
import { MissionVisionCard } from "@/components/easycomponents/about/MissionVisionCard";
import { CoreValueCard } from "@/components/easycomponents/about/CoreValueCard";
import { TeamMemberCard } from "@/components/easycomponents/about/TeamMemberCard";
import { SectionHeader } from "@/components/easycomponents/SectionHeader";

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-10 min-h-screen bg-white dark:bg-background">
            {/* Hero */}
            <div className="container mx-auto px-4">
                <AboutHero
                    title="Empowering Africa's Workforce"
                    subtitle="We're on a mission to connect talent with opportunity, fostering economic growth and innovation across the continent."
                />
            </div>

            {/* Mission & Vision */}
            <section className="">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <MissionVisionCard
                            title="Our Vision"
                            description="We envision a world where every individual has access to meaningful work and every company can find the talent they need to thrive, regardless of location."
                        />
                        <MissionVisionCard
                            title="Our Mission"
                            description="To build the most trusted and efficient recruitment infrastructure in Africa, leveraging technology to remove barriers and create seamless connections"
                        />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="">
                <div className="container mx-auto px-4">
                    <div className="mb-8 md:mb-10">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="max-w-xl">
                                <SectionHeader
                                    sectionSubCaption="VALUES & BELIEFS"
                                    sectionTitle="EasyRecruit Core Values & Beliefs that drives it"
                                    align="left"
                                    className="bg-transparent p-0"
                                    titleClassName="text-3xl md:text-5xl dark:text-white"
                                />
                            </div>
                            <p className="text-gray-600 dark:text-muted-foreground text-sm md:text-base max-w-md text-right md:text-left">
                                We adhere to the highest standards of quality in all our products and services. From design and development to manufacturing and customer support, we maintain rigorous quality control measures to ensure consistency.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CoreValueCard
                            number={1}
                            title="Pan African"
                            description="Building specifically for the African context."
                            icon={Globe}
                        />
                        <CoreValueCard
                            number={2}
                            title="Excellence"
                            description="Committed to the highest quality standards."
                            icon={Award}
                        />
                        <CoreValueCard
                            number={3}
                            title="Community"
                            description="Bringing Jobs an Opportunities to the Community of Africa."
                            icon={Users}
                        />
                        <CoreValueCard
                            number={3}
                            title="Passion"
                            description="Driven by a desire to make a difference in the HR sector."
                            icon={Heart}
                        />
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="pt-6 dark:bg-accent/20">
                <div className="container mx-auto px-4">
                    <div className="mb-6 max-w-xl">
                        <SectionHeader
                            sectionSubCaption="THE EASYRECRUIT TEAM"
                            sectionTitle="The Creative Team Powering Our Success"
                            align="left"
                            className="bg-transparent p-0"
                            titleClassName="text-3xl md:text-5xl dark:text-white"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TeamMemberCard
                            name="Sebastian Chimwala"
                            role="FOUNDER & CEO"
                            image="/brand-assets/visual-assets/illustrations/team-members/member-image-3.png"
                        />
                        <TeamMemberCard
                            name="Ahmed Janny Daud"
                            role="SYSTEMS ENGINEER"
                            image="/brand-assets/visual-assets/illustrations/team-members/member-image-2.png"
                            isCenter={true}
                        />
                        <TeamMemberCard
                            name="Mr Geofrey Damison"
                            role="HEAD OF HUMAN RESOURCE"
                            image="/brand-assets/visual-assets/illustrations/team-members/member-image-1.png"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
