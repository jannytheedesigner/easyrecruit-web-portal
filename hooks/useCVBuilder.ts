import { useState, useCallback, useEffect } from 'react';
import axiosClient, { initCsrf } from '@/lib/axiosClient';
import { toast } from '@/components/ui/use-toast';
import {
    ProfileDetails,
    EducationHistory,
    WorkExperience,
    SkillProficiency,
} from '@/types/resume';

const STORAGE_KEY = 'cv_builder_draft';

interface CVBuilderData {
    profile: ProfileDetails;
    education: EducationHistory[];
    experiences: WorkExperience[];
    skills: SkillProficiency[];
    interests: number[];
    categories: number[];
    resumeData: {
        title: string;
        template_name: string;
        is_default: boolean;
    };
    sessionId: string;
}

const getDefaultData = (): CVBuilderData => ({
    profile: {
        current_job_title: '',
        experience_years: 0,
        expected_salary: 0,
        district: '',
        town: '',
        languages: [],
        willing_to_relocate: false,
    },
    education: [],
    experiences: [],
    skills: [],
    interests: [],
    categories: [],
    resumeData: {
        title: '',
        template_name: 'modern',
        is_default: false,
    },
    sessionId: `cv_session_${Date.now()}`,
});

export const useCVBuilder = () => {
    const [data, setData] = useState<CVBuilderData>(getDefaultData());
    const [isLoading, setIsLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initialize with stored data
    useEffect(() => {
        const loadData = async () => {
            try {
                await initCsrf();
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setData(JSON.parse(stored));
                }
                // Fetch initial data from server
                await refreshFromServer();
            } catch (error) {
                console.warn('Failed to load CV builder data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, isLoading]);

    const refreshFromServer = useCallback(async () => {
        try {
            const [profileRes, eduRes, expRes, skillsRes] = await Promise.all([
                axiosClient.get('/onboarding/jobseeker/basic-details').catch(() => null),
                axiosClient.get('/onboarding/jobseeker/education-background').catch(() => null),
                axiosClient.get('/onboarding/jobseeker/work-experience').catch(() => null),
                axiosClient.get('/onboarding/jobseeker/skills-and-interests').catch(() => null),
            ]);

            setData((prevData) => ({
                ...prevData,
                profile: profileRes?.data?.jobseeker ? {
                    current_job_title: profileRes.data.jobseeker.current_job_title || '',
                    experience_years: Number(profileRes.data.jobseeker.experience_years) || 0,
                    expected_salary: Number(profileRes.data.jobseeker.expected_salary) || 0,
                    district: profileRes.data.jobseeker.district || '',
                    town: profileRes.data.jobseeker.town || '',
                    languages: Array.isArray(profileRes.data.jobseeker.languages)
                        ? profileRes.data.jobseeker.languages
                        : profileRes.data.jobseeker.languages
                            ? JSON.parse(profileRes.data.jobseeker.languages)
                            : [],
                    willing_to_relocate:
                        profileRes.data.jobseeker.willing_to_relocate === 1 ||
                        profileRes.data.jobseeker.willing_to_relocate === true,
                } : prevData.profile,
                education: eduRes?.data?.educations
                    ? eduRes.data.educations.map((e: any) => ({
                        ...e,
                        year_completed: Number(e.year_completed),
                    }))
                    : prevData.education,
                experiences: expRes?.data?.experiences || prevData.experiences,
                skills: skillsRes?.data?.skills
                    ? skillsRes.data.skills.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        proficiency_level: s.pivot?.proficiency_level || s.proficiency_level || 'intermediate',
                        years_of_experience: s.pivot?.years_of_experience || s.years_of_experience || 1,
                    }))
                    : prevData.skills,
                interests: skillsRes?.data?.interests
                    ? skillsRes.data.interests.map((i: any) => i.id || i)
                    : prevData.interests,
                categories: skillsRes?.data?.job_categories
                    ? skillsRes.data.job_categories.map((c: any) => c.id || c)
                    : prevData.categories,
            }));
        } catch (error) {
            console.warn('Failed to fetch server data:', error);
        }
    }, []);

    const updateProfile = useCallback((newProfile: Partial<ProfileDetails>) => {
        setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...newProfile },
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateEducation = useCallback((education: EducationHistory[]) => {
        setData((prev) => ({
            ...prev,
            education,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateExperiences = useCallback((experiences: WorkExperience[]) => {
        setData((prev) => ({
            ...prev,
            experiences,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateSkills = useCallback((skills: SkillProficiency[]) => {
        setData((prev) => ({
            ...prev,
            skills,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateInterests = useCallback((interests: number[]) => {
        setData((prev) => ({
            ...prev,
            interests,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateCategories = useCallback((categories: number[]) => {
        setData((prev) => ({
            ...prev,
            categories,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateResumeData = useCallback(
        (resumeData: Partial<typeof data.resumeData>) => {
            setData((prev) => ({
                ...prev,
                resumeData: { ...prev.resumeData, ...resumeData },
            }));
        },
        []
    );

    const saveProfile = async () => {
        try {
            await axiosClient.put('/profile/details', data.profile);
            toast({ title: 'Profile saved successfully' });
            setHasUnsavedChanges(false);
            return true;
        } catch (error: any) {
            toast({
                title: 'Error saving profile',
                description: error?.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
            return false;
        }
    };

    const saveEducation = async () => {
        try {
            const validEdu = data.education.filter(
                (e) => e.level && e.qualification && e.institution
            );
            if (validEdu.length > 0) {
                await Promise.all(
                    validEdu.map((e) =>
                        axiosClient.post('/job-seeker-educations', e)
                    )
                );
            }
            setHasUnsavedChanges(false);
            return true;
        } catch (error: any) {
            toast({
                title: 'Error saving education',
                description: error?.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
            return false;
        }
    };

    const saveExperiences = async () => {
        try {
            const validExp = data.experiences.filter(
                (e) => e.organisation && e.role && e.start_date
            );
            if (validExp.length > 0) {
                await Promise.all(
                    validExp.map((e) =>
                        axiosClient.post('/job-seeker-experiences', e)
                    )
                );
            }
            setHasUnsavedChanges(false);
            return true;
        } catch (error: any) {
            toast({
                title: 'Error saving experiences',
                description: error?.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
            return false;
        }
    };

    const saveSkillsAndInterests = async () => {
        try {
            const payload = {
                skills: data.skills
                    .filter((s) => s.id > 0)
                    .map((s) => ({
                        id: s.id,
                        proficiency_level: s.proficiency_level,
                        years_of_experience: Number(s.years_of_experience) || 1,
                    })),
                interests: data.interests,
                job_categories: data.categories,
            };

            if (payload.skills.length === 0) {
                toast({
                    title: 'Skills required',
                    description: 'Please add at least one skill to continue',
                    variant: 'destructive',
                });
                return false;
            }

            await axiosClient.post(
                '/onboarding/jobseeker/skills-and-interests',
                payload
            );
            setHasUnsavedChanges(false);
            return true;
        } catch (error: any) {
            toast({
                title: 'Error saving skills',
                description: error?.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
            return false;
        }
    };

    const saveResume = async () => {
        try {
            const res = await axiosClient.post('/resumes', data.resumeData);
            const resumeId = res.data?.id || res.data?.data?.id;
            const genRes = await axiosClient.post(`/resumes/${resumeId}/generate-pdf`);
            setHasUnsavedChanges(false);
            return {
                id: resumeId,
                pdf_url: genRes.data?.url || genRes.data?.data?.url,
            };
        } catch (error: any) {
            toast({
                title: 'Error saving resume',
                description: error?.response?.data?.message || 'Please try again',
                variant: 'destructive',
            });
            return null;
        }
    };

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setData(getDefaultData());
        setHasUnsavedChanges(false);
    };

    return {
        data,
        isLoading,
        hasUnsavedChanges,
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
        clearDraft,
        refreshFromServer,
    };
};
