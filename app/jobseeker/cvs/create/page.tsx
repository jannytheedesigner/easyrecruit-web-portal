"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    User,
    GraduationCap,
    Briefcase,
    Code,
    FileText,
    Eye,
} from "lucide-react";
import { useCVBuilder } from "@/hooks/useCVBuilder";
import { Loader } from "@/components/Loader";
import {
    CVBuilderLayout,
    ProfileStep,
    EducationStep,
    ExperienceStep,
    SkillsStep,
    ResumeSettingsStep,
    ResultStep,
} from "@/components/cv-builder";
import { CVPreview } from "@/components/cv-preview";
import axiosClient from "@/lib/axiosClient";

const STEPS = [
    {
        title: "Profile",
        description: "Your professional information",
        icon: User,
    },
    {
        title: "Education",
        description: "Academic qualifications",
        icon: GraduationCap,
    },
    {
        title: "Experience",
        description: "Work history",
        icon: Briefcase,
    },
    {
        title: "Skills",
        description: "Technical & professional skills",
        icon: Code,
    },
    {
        title: "Settings",
        description: "Resume customization",
        icon: FileText,
    },
    {
        title: "Review",
        description: "Final resume preview",
        icon: Eye,
    },
];

export default function CreateCVPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [availableSkills, setAvailableSkills] = useState<any[]>([]);
    const [availableInterests, setAvailableInterests] = useState<any[]>([]);
    const [availableCategories, setAvailableCategories] = useState<any[]>([]);
    const [generatedResume, setGeneratedResume] = useState<{
        id: number;
        pdf_url: string;
    } | null>(null);

    const {
        data,
        isLoading,
        updateProfile,
        updateEducation,
        updateExperiences,
        updateSkills,
        updateInterests,
        updateCategories,
        updateResumeData,
        saveProfile,
        saveEducation,
        saveExperiences,
        saveSkillsAndInterests,
        saveResume,
    } = useCVBuilder();

    // Fetch available options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [skillsRes, interestsRes, categoriesRes] = await Promise.all([
                    axiosClient.get("/easydata/skills"),
                    axiosClient.get("/easydata/interests"),
                    axiosClient.get("/easydata/categories"),
                ]);

                setAvailableSkills(skillsRes.data?.data || skillsRes.data || []);
                setAvailableInterests(interestsRes.data?.data || interestsRes.data || []);
                setAvailableCategories(categoriesRes.data?.data || categoriesRes.data || []);
            } catch (error) {
                console.error("Failed to fetch options:", error);
            }
        };

        fetchOptions();
    }, []);

    const handleNext = async () => {
        setIsProcessing(true);
        try {
            if (currentStep === 0) {
                // Save profile
                const success = await saveProfile();
                if (success) {
                    setCurrentStep(1);
                }
            } else if (currentStep === 1) {
                // Save education
                const success = await saveEducation();
                if (success) {
                    setCurrentStep(2);
                }
            } else if (currentStep === 2) {
                // Save experiences
                const success = await saveExperiences();
                if (success) {
                    setCurrentStep(3);
                }
            } else if (currentStep === 3) {
                // Save skills and interests
                const success = await saveSkillsAndInterests();
                if (success) {
                    setCurrentStep(4);
                }
            } else if (currentStep === 4) {
                // Save resume and generate PDF
                const result = await saveResume();
                if (result) {
                    setGeneratedResume(result);
                    setCurrentStep(5);
                }
            } else if (currentStep === 5) {
                // Final step - redirect to CVs page
                router.push("/jobseeker/cvs");
            }
        } catch (error) {
            console.error("Error processing step:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <CVBuilderLayout
            steps={STEPS}
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isProcessing}
            isFinalStep={currentStep === STEPS.length - 1}
            preview={<CVPreview data={{
                profile: data.profile,
                education: data.education,
                experiences: data.experiences,
                skills: data.skills,
                interests: data.interests,
                summary: '',
                resumeSettings: {
                    title: data.resumeData?.title || '',
                    template_name: data.resumeData?.template_name || 'modern',
                },
                availableSkills: availableSkills,
            }} />}
        >
            {/* Profile Step */}
            {currentStep === 0 && (
                <ProfileStep
                    data={data.profile}
                    onChange={updateProfile}
                />
            )}

            {/* Education Step */}
            {currentStep === 1 && (
                <EducationStep
                    data={data.education}
                    onChange={updateEducation}
                />
            )}

            {/* Experience Step */}
            {currentStep === 2 && (
                <ExperienceStep
                    data={data.experiences}
                    onChange={updateExperiences}
                />
            )}

            {/* Skills Step */}
            {currentStep === 3 && (
                <SkillsStep
                    skills={data.skills}
                    interests={data.interests}
                    categories={data.categories}
                    availableSkills={availableSkills}
                    availableInterests={availableInterests}
                    availableCategories={availableCategories}
                    onSkillsChange={updateSkills}
                    onInterestsChange={updateInterests}
                    onCategoriesChange={updateCategories}
                />
            )}

            {/* Resume Settings Step */}
            {currentStep === 4 && (
                <ResumeSettingsStep
                    data={data.resumeData}
                    onChange={updateResumeData}
                />
            )}

            {/* Result Step */}
            {currentStep === 5 && (
                <ResultStep
                    resumeId={generatedResume?.id || 0}
                    resumeTitle={data.resumeData.title}
                    pdfUrl={generatedResume?.pdf_url}
                    isGenerating={isProcessing}
                />
            )}
        </CVBuilderLayout>
    );
}
