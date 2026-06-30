"use client";

import { ProfileDetails, EducationHistory, WorkExperience, SkillProficiency } from "@/types/resume";
import { User, Mail, MapPin, Briefcase, GraduationCap, Award, Globe, Phone, ExternalLink, Calendar, Star, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

interface CVPreviewProps {
    data: {
        profile: ProfileDetails;
        education: EducationHistory[];
        experiences: WorkExperience[];
        skills: SkillProficiency[];
        interests?: any[];
        resumeSettings: {
            title: string;
            template_name: string;
        };
        availableSkills?: any[];
    };
}

export function CVPreview({ data }: CVPreviewProps) {
    const { profile, education, experiences, skills, resumeSettings, availableSkills } = data;

    const getSkillName = (s: SkillProficiency) =>
        s.name || availableSkills?.find(sk => sk.id === s.id)?.name || "Technical Skill";

    const proficiencyPercent = (level: string) => {
        switch (level.toLowerCase()) {
            case 'expert': return 100;
            case 'advanced': return 85;
            case 'intermediate': return 65;
            case 'beginner': return 35;
            default: return 50;
        }
    };

    const Watermark = () => (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.015] -rotate-45 select-none overflow-hidden z-0">
            <span className="text-[12rem] font-black tracking-widest uppercase whitespace-nowrap text-slate-900">
                EASYCV · EASYRECRUIT · 
            </span>
        </div>
    );

    const BrandingFooter = () => (
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center">
                    <span className="text-white text-[8px]">ER</span>
                </div>
                <span>Certified Document</span>
            </div>
            <span>Powering Career Journeys via EasyRecruit</span>
        </div>
    );

    // ── MODERN TEMPLATE (High Impact) ──
    if (resumeSettings.template_name === "modern") {
        return (
            <div className="bg-white min-h-[1100px] shadow-2xl relative overflow-hidden font-sans text-slate-800 flex flex-col">
                <div className="absolute top-0 left-0 w-2 h-full bg-slate-900" />
                <Watermark />

                <div className="flex flex-1 relative z-10">
                    {/* Left Rail (Sidebar) */}
                    <div className="w-[320px] bg-slate-50/80 backdrop-blur-sm p-10 space-y-12 border-r border-slate-100">
                        {/* Profile Header in Sidebar */}
                        <div className="space-y-4">
                            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                                {profile.current_job_title?.charAt(0) || "U"}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                                {profile.full_name || "Your Name"}
                            </h1>
                            <p className="text-xs font-bold text-er-primary uppercase tracking-widest">{profile.current_job_title}</p>
                            <div className="space-y-2.5 pt-2">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{profile.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{profile.district}, {profile.town}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                    <span>{profile.experience_years} Years Experience</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span>{profile.languages?.join(", ") || "English"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                <Star className="w-3.5 h-3.5" /> Proficiencies
                            </h3>
                            <div className="space-y-5">
                                {skills.map((s, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black text-slate-700">{getSkillName(s)}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{s.proficiency_level}</span>
                                        </div>
                                        <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-slate-900 rounded-full transition-all duration-1000" 
                                                style={{ width: `${proficiencyPercent(s.proficiency_level)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Details Card */}
                        <section className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Expected Compensation</p>
                                <p className="text-sm font-bold">MWK {profile.expected_salary?.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>{profile.willing_to_relocate ? "Open to Global Relocation" : "Prefers Local Roles"}</span>
                            </div>
                        </section>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-12 space-y-12">
                        {/* Summary / Intro */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Career Path</h2>
                                <div className="flex-1 h-[2px] bg-slate-100" />
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Professional {profile.current_job_title} with {profile.experience_years} years of strategic experience in regional and international markets. Committed to delivering excellence through specialized skills in {skills.slice(0, 3).map(s => getSkillName(s)).join(", ")}.
                            </p>
                        </section>

                        {/* Experience */}
                        <section className="space-y-8">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-8 h-px bg-slate-900" /> Professional Tenure
                            </h3>
                            <div className="space-y-8">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 leading-tight uppercase group-hover:text-indigo-600 transition-colors">
                                                    {exp.role}
                                                </h4>
                                                <p className="text-sm font-bold text-slate-500">{exp.organisation}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                    {exp.start_date} — {exp.end_date || "Present"}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-slate-100 group-hover:border-slate-900 transition-all">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-8 h-px bg-slate-900" /> Academic Credentials
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                {education.map((edu, idx) => (
                                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <GraduationCap className="w-6 h-6 text-slate-900" />
                                            <span className="text-[10px] font-black text-slate-400">Class of {edu.year_completed}</span>
                                        </div>
                                        <h4 className="font-black text-slate-900 text-sm mb-1">{edu.qualification}</h4>
                                        <p className="text-xs font-bold text-slate-500">{edu.institution}</p>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase mt-2 tracking-widest">{edu.level}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-10 mt-auto">
                    <BrandingFooter />
                </div>
            </div>
        );
    }

    // ── EXECUTIVE TEMPLATE (Formal & Structured) ──
    if (resumeSettings.template_name === "executive") {
        return (
            <div className="bg-white min-h-[1100px] p-16 shadow-2xl relative overflow-hidden font-serif text-slate-900">
                <div className="absolute top-0 left-0 right-0 h-4 bg-slate-900" />
                <Watermark />

                <div className="relative z-10 space-y-12">
                    <header className="text-center space-y-4 border-b-2 border-slate-900 pb-10">
                        <h1 className="text-5xl font-black uppercase tracking-tight leading-none text-slate-900 mb-2">
                            {profile.full_name || "Your Name"}
                        </h1>
                        <p className="text-lg font-bold text-slate-600 uppercase tracking-[0.2em]">{profile.current_job_title}</p>
                        <div className="flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pt-4">
                            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {profile.district}</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-8 space-y-12">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Executive Summary</h3>
                                <p className="text-sm leading-relaxed text-slate-700 italic">
                                    Accomplished {profile.current_job_title} with over {profile.experience_years} years of professional excellence. Demonstrated expertise in high-level operations and strategic project management, with a track record of driving significant business outcomes in {profile.district} and beyond.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Professional History</h3>
                                <div className="space-y-10">
                                    {experiences.map((exp, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-lg font-black uppercase tracking-tight">{exp.role}</h4>
                                                <span className="text-[10px] font-black italic">{exp.start_date} — {exp.end_date || "Present"}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">{exp.organisation}</p>
                                            <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="col-span-4 space-y-10">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Core Competencies</h3>
                                <div className="space-y-4">
                                    {skills.map((s, idx) => (
                                        <div key={idx}>
                                            <p className="text-[10px] font-black uppercase mb-1">{getSkillName(s)}</p>
                                            <div className="h-1 bg-slate-100">
                                                <div className="h-full bg-slate-900" style={{ width: `${proficiencyPercent(s.proficiency_level)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Academic Credentials</h3>
                                <div className="space-y-6">
                                    {education.map((edu, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <h4 className="text-xs font-black uppercase">{edu.qualification}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 italic">{edu.institution}</p>
                                            <p className="text-[9px] font-black text-slate-400">Class of {edu.year_completed}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <BrandingFooter />
            </div>
        );
    }

    // ── MINIMALIST TEMPLATE (Clean & Balanced) ──
    return (
        <div className="bg-white min-h-[1100px] p-20 shadow-2xl relative font-sans text-slate-900">
            <Watermark />
            
            <div className="relative z-10 space-y-16">
                <header className="flex justify-between items-start border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-slate-900">
                            {profile.full_name || "Your Name"}
                        </h1>
                        <p className="text-lg font-bold text-er-primary uppercase tracking-[0.3em] mt-2">{profile.current_job_title}</p>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-6">
                            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {profile.district}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Resume Identity</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{resumeSettings.title}</p>
                    </div>
                </header>

                <div className="grid grid-cols-3 gap-16">
                    <div className="col-span-2 space-y-12">
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Professional Background</h3>
                            <div className="space-y-10">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-bold tracking-tight text-slate-900">{exp.role}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.start_date} — {exp.end_date || "Present"}</span>
                                        </div>
                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">{exp.organisation}</p>
                                        <p className="text-xs leading-relaxed text-slate-500 font-medium">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Skillsets</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s, idx) => (
                                    <div key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-700">
                                        {getSkillName(s)}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Education</h3>
                            <div className="space-y-6">
                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-black uppercase text-slate-900">{edu.qualification}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1">{edu.institution}</p>
                                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1 tracking-widest">{edu.year_completed}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <BrandingFooter />
        </div>
    );
}

