"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Download, Save, Plus, Trash2, FileText, User, Briefcase,
    GraduationCap, Award, ChevronDown, ChevronUp, Palette, Eye,
    CheckCircle, Loader2, RefreshCw, ExternalLink, Sparkles, Star,
    LayoutTemplate, Pencil, AlignLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosClient, { initCsrf } from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { ProfileDetails, EducationHistory, WorkExperience, SkillProficiency } from "@/types/resume";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CVRecord {
    id: number;
    title: string;
    summary?: string;
    template_name: string;
    is_default: boolean;
    pdf_url?: string;
    created_at: string;
    updated_at: string;
}

// ─── Template definitions ─────────────────────────────────────────────────────

const TEMPLATES = [
    { id: "modern", label: "Modern", accent: "#6366f1" },
    { id: "classic", label: "Classic", accent: "#1e293b" },
    { id: "minimal", label: "Minimal", accent: "#0ea5e9" },
    { id: "executive", label: "Executive", accent: "#7c3aed" },
];

import { CVPreview } from "@/components/cv-preview";

// ─── Local Components ────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-er-primary" />
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CVPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const cvId = params?.id as string;
    const printRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [cv, setCv] = useState<CVRecord | null>(null);
    // summary is kept as its own state for clarity and passed to the preview
    const [summary, setSummary] = useState("");
    const [profile, setProfile] = useState<ProfileDetails>({
        current_job_title: "", experience_years: 0, expected_salary: 0,
        district: "", town: "", languages: [], willing_to_relocate: false,
    });
    const [education, setEducation] = useState<EducationHistory[]>([]);
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [skills, setSkills] = useState<SkillProficiency[]>([]);
    const [availableSkills, setAvailableSkills] = useState<any[]>([]);
    const [langInput, setLangInput] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                await initCsrf();

                // Fetch core CV data and available skills in parallel
                const [cvRes, skillsRes] = await Promise.all([
                    axiosClient.get(`/resumes/${cvId}`).catch(err => {
                        console.error("CV fetch failed:", err);
                        return { data: null };
                    }),
                    axiosClient.get("/easydata/skills").catch(() => ({ data: { data: [] } })),
                ]);

                const cvData = cvRes.data?.data || cvRes.data;
                if (!cvData) throw new Error("CV not found");

                setCv(cvData);
                setSummary(cvData.summary || "");
                setAvailableSkills(skillsRes.data?.data || []);

                // Load profile sections in parallel
                const [profileRes, eduRes, expRes, skIntRes] = await Promise.all([
                    axiosClient.get("/onboarding/jobseeker/basic-details").catch(() =>
                        axiosClient.get("/profile").catch(() => ({ data: {} }))
                    ),
                    axiosClient.get("/onboarding/jobseeker/education-background").catch(() => ({ data: {} })),
                    axiosClient.get("/onboarding/jobseeker/work-experience").catch(() => ({ data: {} })),
                    axiosClient.get("/onboarding/jobseeker/skills-and-interests").catch(() => ({ data: {} })),
                ]);

                // Extract jobseeker data (handle both wrapped and flat responses)
                const d = profileRes.data?.jobseeker || profileRes.data?.data?.jobseeker || profileRes.data?.data || profileRes.data || {};

                setProfile({
                    full_name: d.user?.name || user?.name || "",
                    email: d.user?.email || user?.email || "",
                    phone: d.phone || d.phone_primary || "",
                    current_job_title: d.current_job_title || cvData.title || "",
                    experience_years: Number(d.experience_years) || 0,
                    expected_salary: Number(d.expected_salary) || 0,
                    district: d.district || "",
                    town: d.town || "",
                    languages: Array.isArray(d.languages)
                        ? d.languages
                        : d.languages
                            ? (typeof d.languages === "string" ? JSON.parse(d.languages) : d.languages)
                            : [],
                    willing_to_relocate: d.willing_to_relocate === 1 || d.willing_to_relocate === true,
                });

                if (eduRes.data?.educations || eduRes.data?.data?.educations) {
                    const edus = eduRes.data?.educations || eduRes.data?.data?.educations || [];
                    setEducation(edus.map((e: any) => ({
                        ...e,
                        year_completed: Number(e.year_completed)
                    })));
                }

                if (expRes.data?.experiences || expRes.data?.data?.experiences) {
                    setExperiences(expRes.data?.experiences || expRes.data?.data?.experiences || []);
                }

                if (skIntRes.data?.skills || skIntRes.data?.data?.skills) {
                    const sks = skIntRes.data?.skills || skIntRes.data?.data?.skills || [];
                    setSkills(sks.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        proficiency_level: s.pivot?.proficiency_level || s.proficiency_level || "intermediate",
                        years_of_experience: s.pivot?.years_of_experience || s.years_of_experience || 1,
                    })));
                }

            } catch (err) {
                console.error("Load error:", err);
                toast({ title: "Error", description: "Failed to load CV data", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [cvId, user]);


    const handleSave = async () => {
        if (!cv) return;
        setSaving(true);
        try {
            await Promise.all([
                // 1. Save CV record (title, template, summary, default flag)
                axiosClient.put(`/resumes/${cvId}`, {
                    title: cv.title,
                    template_name: cv.template_name,
                    is_default: cv.is_default,
                    summary,
                }),
                // 2. Save jobseeker profile via the correct onboarding endpoint
                axiosClient.post("/onboarding/jobseeker/basic-details", {
                    current_job_title: profile.current_job_title,
                    experience_years: profile.experience_years,
                    expected_salary: profile.expected_salary,
                    district: profile.district,
                    town: profile.town,
                    languages: profile.languages,
                    willing_to_relocate: profile.willing_to_relocate,
                }),
            ]);

            // 3. Upsert education entries (PUT if id exists, POST if new)
            const validEdu = education.filter(e => e.level && e.qualification && e.institution);
            if (validEdu.length > 0) {
                await Promise.all(
                    validEdu.map(e =>
                        e.id
                            ? axiosClient.put(`/job-seeker-educations/${e.id}`, e)
                            : axiosClient.post("/job-seeker-educations", e)
                    )
                );
            }

            // 4. Upsert experience entries
            const validExp = experiences.filter(e => e.organisation && e.role && e.start_date);
            if (validExp.length > 0) {
                await Promise.all(
                    validExp.map(e =>
                        e.id
                            ? axiosClient.put(`/job-seeker-experiences/${e.id}`, e)
                            : axiosClient.post("/job-seeker-experiences", e)
                    )
                );
            }

            // Update local cv state with saved summary
            setCv(prev => prev ? { ...prev, summary } : prev);
            setLastSaved(new Date());
            toast({ title: "✅ Saved!", description: "All changes have been saved successfully." });
        } catch (err: any) {
            toast({ title: "Error saving", description: err?.response?.data?.message || "Something went wrong", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const genRes = await axiosClient.post(`/resumes/${cvId}/generate-pdf`);
            const pdfUrl = genRes.data?.url || genRes.data?.data?.url;
            if (pdfUrl) {
                window.open(pdfUrl, "_blank");
            } else {
                // Fallback: direct download blob
                const response = await axiosClient.get(`/resumes/${cvId}/download`, { responseType: "blob" });
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${cv?.title?.replace(/\s+/g, "_") || "resume"}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
            toast({ title: "📄 Download started!" });
        } catch (err: any) {
            toast({ title: "Download failed", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-er-primary animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading CV Studio…</p>
                </div>
            </div>
        );
    }

    if (!cv) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <FileText className="w-16 h-16 text-slate-200" />
                <h2 className="text-2xl font-bold text-slate-700">CV not found</h2>
                <Link href="/jobseeker/cvs"><Button>Back to My CVs</Button></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans">
            {/* ── TOP BAR ── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 h-[68px] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/jobseeker/cvs" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="font-black text-slate-900 text-sm leading-none">{cv.title}</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            CV Studio · {cv.template_name} template
                            {lastSaved && (
                                <span className="ml-2 text-emerald-500">· Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            )}
                        </p>
                    </div>
                    {cv.is_default && (
                        <span className="flex items-center gap-1.5 bg-er-primary/10 text-er-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-current" /> Principal
                        </span>
                    )}
                </div>

                {/* Tab Toggle (mobile) */}
                <div className="lg:hidden flex items-center bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === "preview" ? "bg-white shadow text-slate-900" : "text-slate-400"}`}
                    >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />Preview
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === "edit" ? "bg-white shadow text-slate-900" : "text-slate-400"}`}
                    >
                        <Pencil className="w-3.5 h-3.5 inline mr-1" />Edit
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={saving}
                        className="h-9 px-4 border-slate-200 font-bold text-xs text-slate-700 hidden sm:flex"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                        Save Changes
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="h-9 px-4 bg-er-primary hover:bg-er-primary/90 text-white font-bold text-xs shadow-lg shadow-er-primary/20"
                    >
                        {downloading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                        Download PDF
                    </Button>
                </div>
            </header>

            {/* ── MAIN SPLIT LAYOUT ── */}
            <div className="flex h-[calc(100vh-68px)]">

                {/* ── LEFT PANEL: EDITOR ── */}
                <aside className={`w-full lg:w-[400px] xl:w-[440px] shrink-0 overflow-y-auto bg-white border-r border-slate-200 p-5 space-y-4 ${activeTab === "edit" ? "block" : "hidden"} lg:block`}>

                    {/* Template Selector */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutTemplate className="w-4 h-4 text-er-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Design Template</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setCv({ ...cv, template_name: t.id })}
                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${cv.template_name === t.id ? "border-er-primary bg-er-primary/10 text-er-primary" : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:bg-white/10"}`}
                                >
                                    <FileText className="w-5 h-5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                                    {cv.template_name === t.id && <CheckCircle className="w-3 h-3 text-er-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CV Title */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">CV Title</label>
                        <input
                            value={cv.title}
                            onChange={e => setCv({ ...cv, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                            placeholder="e.g. Senior Developer 2025"
                        />
                    </div>

                    {/* Professional Summary */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <AlignLeft className="w-4 h-4 text-er-primary" />
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Summary</label>
                        </div>
                        <textarea
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none text-slate-900 text-sm transition-all resize-none leading-relaxed"
                            placeholder="Write a compelling professional summary that highlights your key skills, experience, and career goals…"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">{summary.length} characters</p>
                    </div>

                    {/* Bio Section */}
                    <Section title="Bio & Core Info" icon={User} defaultOpen>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Job Title</label>
                                <input
                                    value={profile.current_job_title}
                                    onChange={e => setProfile({ ...profile, current_job_title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">District</label>
                                    <input
                                        value={profile.district}
                                        onChange={e => setProfile({ ...profile, district: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Town</label>
                                    <input
                                        value={profile.town}
                                        onChange={e => setProfile({ ...profile, town: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Years Exp.</label>
                                    <input
                                        type="number"
                                        value={profile.experience_years}
                                        onChange={e => setProfile({ ...profile, experience_years: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Expected Salary</label>
                                    <input
                                        type="number"
                                        value={profile.expected_salary}
                                        onChange={e => setProfile({ ...profile, expected_salary: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Languages</label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {profile.languages?.map((lang, i) => (
                                        <span key={i} className="flex items-center gap-1 text-xs font-bold bg-er-primary/10 text-er-primary px-2.5 py-1 rounded-full">
                                            {lang}
                                            <button onClick={() => setProfile({ ...profile, languages: profile.languages.filter((_, li) => li !== i) })} className="text-er-primary/50 hover:text-er-primary ml-0.5">✕</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={langInput}
                                        onChange={e => setLangInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" && langInput.trim()) { setProfile({ ...profile, languages: [...(profile.languages || []), langInput.trim()] }); setLangInput(""); } }}
                                        placeholder="Type & press Enter"
                                        className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border-2 border-transparent focus:border-er-primary/30 focus:bg-white outline-none font-bold text-slate-900 text-xs transition-all"
                                    />
                                    <button
                                        onClick={() => { if (langInput.trim()) { setProfile({ ...profile, languages: [...(profile.languages || []), langInput.trim()] }); setLangInput(""); } }}
                                        className="w-8 h-8 bg-er-primary text-white rounded-lg flex items-center justify-center shrink-0"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setProfile({ ...profile, willing_to_relocate: !profile.willing_to_relocate })}
                                    className={`w-10 h-5 rounded-full transition-all relative ${profile.willing_to_relocate ? "bg-er-primary" : "bg-slate-200"}`}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${profile.willing_to_relocate ? "left-5" : "left-0.5"}`} />
                                </div>
                                <span className="text-xs font-bold text-slate-700">Open to relocation</span>
                            </label>
                        </div>
                    </Section>

                    {/* Education Section */}
                    <Section title="Education" icon={GraduationCap}>
                        <div className="space-y-4 pt-4">
                            {education.map((edu, idx) => (
                                <div key={edu.id ?? idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                    <button
                                        onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                                        className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Level</label>
                                            <input value={edu.level} onChange={e => { const n = [...education]; n[idx].level = e.target.value; setEducation(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Year</label>
                                            <input type="number" value={edu.year_completed} onChange={e => { const n = [...education]; n[idx].year_completed = Number(e.target.value); setEducation(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Qualification</label>
                                        <input value={edu.qualification} onChange={e => { const n = [...education]; n[idx].qualification = e.target.value; setEducation(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Institution</label>
                                        <input value={edu.institution} onChange={e => { const n = [...education]; n[idx].institution = e.target.value; setEducation(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setEducation([...education, { level: "", qualification: "", institution: "", year_completed: new Date().getFullYear() }])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-er-primary/40 hover:text-er-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Education
                            </button>
                        </div>
                    </Section>

                    {/* Experience Section */}
                    <Section title="Work Experience" icon={Briefcase}>
                        <div className="space-y-4 pt-4">
                            {experiences.map((exp, idx) => (
                                <div key={exp.id ?? idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                    <button
                                        onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                                        className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role</label>
                                            <input value={exp.role} onChange={e => { const n = [...experiences]; n[idx].role = e.target.value; setExperiences(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Organisation</label>
                                            <input value={exp.organisation} onChange={e => { const n = [...experiences]; n[idx].organisation = e.target.value; setExperiences(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Start</label>
                                                <input type="date" value={exp.start_date} onChange={e => { const n = [...experiences]; n[idx].start_date = e.target.value; setExperiences(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">End</label>
                                                <input type="date" value={exp.end_date || ""} disabled={exp.end_date === null} onChange={e => { const n = [...experiences]; n[idx].end_date = e.target.value; setExperiences(n); }} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20 disabled:bg-slate-50 disabled:text-slate-300" />
                                                <label className="flex items-center gap-1 mt-1 cursor-pointer">
                                                    <input type="checkbox" checked={exp.end_date === null} onChange={e => { const n = [...experiences]; n[idx].end_date = e.target.checked ? null : ""; setExperiences(n); }} className="w-3 h-3" />
                                                    <span className="text-[9px] font-bold text-slate-400">Present</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                            <textarea value={exp.description} onChange={e => { const n = [...experiences]; n[idx].description = e.target.value; setExperiences(n); }} rows={3} className="w-full px-2.5 py-1.5 bg-white rounded-lg border text-xs outline-none focus:ring-2 ring-er-primary/20 leading-relaxed resize-none" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setExperiences([...experiences, { organisation: "", role: "", start_date: "", end_date: null, contract_type: "full-time", description: "" }])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-er-primary/40 hover:text-er-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Experience
                            </button>
                        </div>
                    </Section>

                    {/* Skills Section */}
                    <Section title="Skills" icon={Award}>
                        <div className="space-y-3 pt-4">
                            {skills.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <select
                                        value={s.id}
                                        onChange={e => { const n = [...skills]; n[idx].id = Number(e.target.value); n[idx].name = availableSkills.find(sk => sk.id === Number(e.target.value))?.name || ""; setSkills(n); }}
                                        className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border text-xs font-bold outline-none focus:ring-2 ring-er-primary/20"
                                    >
                                        <option value={0}>Select skill…</option>
                                        {availableSkills.map((sk: any) => <option key={sk.id} value={sk.id}>{sk.name}</option>)}
                                    </select>
                                    <select
                                        value={s.proficiency_level}
                                        onChange={e => { const n = [...skills]; n[idx].proficiency_level = e.target.value as any; setSkills(n); }}
                                        className="w-24 bg-white px-2 py-1.5 rounded-lg border text-[10px] font-bold text-er-primary outline-none focus:ring-2 ring-er-primary/20"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Inter.</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                    <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setSkills([...skills, { id: 0, proficiency_level: "beginner", years_of_experience: 1 }])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-er-primary/40 hover:text-er-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Skill
                            </button>
                        </div>
                    </Section>

                    {/* Save Button (bottom of editor) */}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-12 bg-er-primary hover:bg-er-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-er-primary/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save All Changes
                    </Button>

                    <div className="h-10" />
                </aside>

                {/* ── RIGHT PANEL: LIVE PREVIEW ── */}
                <main className={`flex-1 overflow-y-auto bg-[#f1f3f8] ${activeTab === "preview" ? "block" : "hidden"} lg:block`}>
                    {/* Preview Toolbar */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Preview · {cv.template_name} template</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> Print
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex items-center gap-1.5 bg-er-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-er-primary/90 transition-colors"
                            >
                                {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                Export PDF
                            </button>
                        </div>
                    </div>

                    {/* The actual CV paper */}
                    <div className="flex justify-center py-10 px-4 print:p-0">
                        <div
                            ref={printRef}
                            className="w-full max-w-[850px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden print:shadow-none print:rounded-none transition-all"
                        >
                            {cv && (
                                <CVPreview
                                    data={{
                                        profile,
                                        education,
                                        experiences,
                                        skills,
                                        summary,
                                        resumeSettings: {
                                            title: cv.title,
                                            template_name: cv.template_name,
                                        },
                                        availableSkills,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Hint bar */}
                    <div className="text-center pb-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2 group">
                            <Sparkles className="w-4 h-4 text-amber-400 group-hover:animate-spin transition-all" />
                            <span>Changes on the left reflect instantly in real-time</span>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
