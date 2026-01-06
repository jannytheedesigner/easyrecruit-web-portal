"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft, FileText, User, Briefcase, GraduationCap, Award, Languages, Code } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Experience {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    current: boolean;
}

interface Skill {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
}

export default function CreateCVPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        template: "modern" as "modern" | "classic" | "minimal",
        is_default: false,
    });

    const [personalInfo, setPersonalInfo] = useState({
        full_name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
        summary: "",
    });

    const [experiences, setExperiences] = useState<Experience[]>([
        {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            current: false,
            description: "",
        },
    ]);

    const [education, setEducation] = useState<Education[]>([
        {
            institution: "",
            degree: "",
            field: "",
            start_date: "",
            end_date: "",
            current: false,
        },
    ]);

    const [skills, setSkills] = useState<Skill[]>([
        { name: "", level: "intermediate" },
    ]);

    const [languages, setLanguages] = useState<string[]>([""]);
    const [certifications, setCertifications] = useState<string[]>([""]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                personal_info: personalInfo,
                experiences: experiences.filter(exp => exp.company && exp.position),
                education: education.filter(edu => edu.institution && edu.degree),
                skills: skills.filter(skill => skill.name),
                languages: languages.filter(lang => lang),
                certifications: certifications.filter(cert => cert),
            };

            await axiosClient.post("/cvs", payload);
            router.push("/jobseeker/cvs");
        } catch (error) {
            console.error("Failed to create CV:", error);
            alert("Failed to create CV. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addExperience = () => {
        setExperiences([...experiences, {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            current: false,
            description: "",
        }]);
    };

    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const updateExperience = (index: number, field: string, value: any) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        setExperiences(updated);
    };

    const addEducation = () => {
        setEducation([...education, {
            institution: "",
            degree: "",
            field: "",
            start_date: "",
            end_date: "",
            current: false,
        }]);
    };

    const removeEducation = (index: number) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const updated = [...education];
        updated[index] = { ...updated[index], [field]: value };
        setEducation(updated);
    };

    const addSkill = () => {
        setSkills([...skills, { name: "", level: "intermediate" }]);
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index: number, field: string, value: any) => {
        const updated = [...skills];
        updated[index] = { ...updated[index], [field]: value };
        setSkills(updated);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/jobseeker/cvs">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create CV</h1>
                            <p className="text-gray-600 mt-1">Build your professional CV</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        CV Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CV Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., Software Developer CV"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template *
                            </label>
                            <select
                                value={formData.template}
                                onChange={(e) => setFormData({ ...formData, template: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="modern">Modern</option>
                                <option value="classic">Classic</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_default}
                                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">Set as default CV</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={personalInfo.full_name}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={personalInfo.phone}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={personalInfo.location}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={personalInfo.linkedin}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                value={personalInfo.website}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Professional Summary
                            </label>
                            <textarea
                                value={personalInfo.summary}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Brief summary of your professional background and goals..."
                            />
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Work Experience
                        </h2>
                        <Button type="button" onClick={addExperience} variant="outline">
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 relative">
                                {experiences.length > 1 && (
                                    <div className="absolute top-4 right-4">
                                        <Button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="month"
                                            value={exp.start_date}
                                            onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="month"
                                            value={exp.end_date}
                                            onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                            disabled={exp.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={(e) => updateExperience(index, "current", e.target.checked)}
                                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-700">I currently work here</span>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Describe your responsibilities and achievements..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Education
                        </h2>
                        <Button type="button" onClick={addEducation} variant="outline">
                            <Plus className="w-4 h-4" />
                            Add Education
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 relative">
                                {education.length > 1 && (
                                    <div className="absolute top-4 right-4">
                                        <Button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Institution
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Degree
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="e.g., Bachelor of Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Field of Study
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="month"
                                            value={edu.start_date}
                                            onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="month"
                                            value={edu.end_date}
                                            onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                                            disabled={edu.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={edu.current}
                                                onChange={(e) => updateEducation(index, "current", e.target.checked)}
                                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-700">I currently study here</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary" />
                            Skills
                        </h2>
                        <Button type="button" onClick={addSkill} variant="outline">
                            <Plus className="w-4 h-4" />
                            Add Skill
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => updateSkill(index, "name", e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Skill name"
                                />
                                <select
                                    value={skill.level}
                                    onChange={(e) => updateSkill(index, "level", e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                                {skills.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeSkill(index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Languages & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Languages className="w-5 h-5 text-primary" />
                            Languages
                        </h2>
                        <div className="space-y-3">
                            {languages.map((lang, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={lang}
                                        onChange={(e) => {
                                            const updated = [...languages];
                                            updated[index] = e.target.value;
                                            setLanguages(updated);
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="e.g., English (Fluent)"
                                    />
                                    {index === languages.length - 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => setLanguages([...languages, ""])}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Certifications
                        </h2>
                        <div className="space-y-3">
                            {certifications.map((cert, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={cert}
                                        onChange={(e) => {
                                            const updated = [...certifications];
                                            updated[index] = e.target.value;
                                            setCertifications(updated);
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="e.g., AWS Certified Developer"
                                    />
                                    {index === certifications.length - 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => setCertifications([...certifications, ""])}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link href="/jobseeker/cvs">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-primary text-white">
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save CV"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
