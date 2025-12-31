"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, DollarSign, Calendar, Users, FileText, Building, Tag, Clock, Wallet, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axiosClient from "@/lib/axiosClient"
import type { Job } from "@/types/job"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface JobFormProps {
    initialData?: Partial<Job>
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
    mode: "create" | "edit"
}

interface Skill {
    id: number
    name: string
}

interface Category {
    id: number
    name: string
}

export function JobForm({ initialData, onSubmit, isLoading = false, mode }: JobFormProps) {
    const router = useRouter()
    const [fetchingOptions, setFetchingOptions] = useState(true)

    // Options state
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
    const [availableCategories, setAvailableCategories] = useState<Category[]>([])
    const [skillInput, setSkillInput] = useState("")

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        job_type: initialData?.job_type || "full_time",
        experience_level: initialData?.experience_level || "intermediate",
        category_id: initialData?.job_category?.id ? String(initialData.job_category.id) : (initialData as any)?.job_category_id ? String((initialData as any).job_category_id) : "",
        budget_type: (initialData as any)?.budget_type || "fixed",
        budget_min: initialData?.budget_min || "",
        budget_max: initialData?.budget_max || "",
        duration: (initialData as any)?.duration || "",
        location: initialData?.location || "",
        skills: [] as (number | string)[], // Can be IDs (create) or names (edit) - normalization needed usually, but logic in modals was mixed. We will try to normalize to IDs if possible, or handle strings for display.
        status: initialData?.status || "open",
    })

    // Normalize initial skills if they are strings/objects
    useEffect(() => {
        if (initialData?.skills) {
            // Logic to handle if skills come as string string "a,b" or array
            // Implementation depends on how `Job` type defines skills vs how API expects them
            // For now we will assume we need to match available skills or just keep them as text if custom
        }
    }, [initialData])

    // Fetch options
    useEffect(() => {
        const fetchOptions = async () => {
            setFetchingOptions(true)
            try {
                const [skillsRes, categoriesRes] = await Promise.all([
                    axiosClient.get("/easydata/skills"),
                    axiosClient.get("/easydata/categories"),
                ])
                setAvailableSkills(skillsRes.data.data || skillsRes.data || [])
                setAvailableCategories(categoriesRes.data.data || categoriesRes.data || [])
            } catch (error) {
                console.error("Failed to fetch options:", error)
            } finally {
                setFetchingOptions(false)
            }
        }
        fetchOptions()
    }, [])

    // Update form data when initialData changes (for edit mode if data loads later)
    useEffect(() => {
        if (initialData) {
            // logic to set form data from initialData
            // This is a bit complex since initialData keys might match Job type but form keys match API payload
            // simplistic mapping for now:
            setFormData(prev => ({
                ...prev,
                title: initialData.title || "",
                description: initialData.description || "",
                job_type: initialData.job_type || "full_time",
                location: initialData.location || "",
                budget_min: initialData.budget_min || "",
                budget_max: initialData.budget_max || "",
                // ... map others
                category_id: (initialData as any).category_id || prev.category_id // Ensure we get the ID if possible
            }))

            // Special handling for skills if they are strings in 'edit' vs IDs in 'create'
            // We'll leave skills logic simple for MVP: text input for custom, or selection from available
        }
    }, [initialData])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (Number(formData.budget_max) < Number(formData.budget_min)) {
            alert("Budget/Salary Max must be greater than Min")
            return
        }

        await onSubmit(formData)
    }

    const handleSkillToggle = (skillId: number) => {
        setFormData(prev => {
            // Assuming skills are stored as IDs for the API
            const currentSkills = prev.skills as number[]
            if (currentSkills.includes(skillId)) {
                return { ...prev, skills: currentSkills.filter(id => id !== skillId) }
            } else {
                return { ...prev, skills: [...currentSkills, skillId] }
            }
        })
    }

    if (fetchingOptions && mode === 'create') {
        return <div className="p-8 text-center">Loading options...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white/0 p-0 rounded-none border border-gray-100">

            {/* Header Section */}
            <div className="border-b border-gray-100 p-8 bg-er-primary rounded-xl">
                <h2 className="text-2xl font-bold text-white">{mode === 'create' ? 'Post a New Job' : 'Edit Job Details'}</h2>
                <p className="text-gray-100 mt-1">Fill in the details below to {mode === 'create' ? 'create a new position' : 'update the position'}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Details Card */}
                    <div className="bg-white p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Job Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary"
                                    placeholder="e.g. Senior Product Designer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={8}
                                    className="px-4 py-4 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary resize-none"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Card */}
                    <div className="bg-white p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            Skills & Competencies
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Relevant Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSkills.map(skill => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(formData.skills as number[]).includes(skill.id)
                                            ? 'bg-er-primary text-white'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-er-primary/50 hover:bg-er-primary/5'
                                            }`}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-6">

                    {/* Configuration Card */}
                    <div className="bg-white p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                                <Select
                                    value={String(formData.category_id)}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                                >
                                    <SelectTrigger className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-er-primary/20 focus:border-er-primary">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCategories.map(cat => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.job_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}
                                >
                                    <SelectTrigger className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-er-primary/20 focus:border-er-primary">
                                        <SelectValue placeholder="Select Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full_time">Full Time</SelectItem>
                                        <SelectItem value="part_time">Part Time</SelectItem>
                                        <SelectItem value="freelance">Freelance</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.experience_level}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                                >
                                    <SelectTrigger className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-er-primary/20 focus:border-er-primary">
                                        <SelectValue placeholder="Select Experience Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="expert">Expert</SelectItem>
                                        <SelectItem value="senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="pl-10 pr-4 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary"
                                        placeholder="e.g. London, UK"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Card */}
                    <div className="bg-white p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-primary" />
                            Budget & Compensation
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Type</label>
                                <Select
                                    value={formData.budget_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget_type: value }))}
                                >
                                    <SelectTrigger className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-er-primary/20 focus:border-er-primary">
                                        <SelectValue placeholder="Select Budget Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed Price</SelectItem>
                                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Min</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">MWK</span>
                                        <Input
                                            type="number"
                                            name="budget_min"
                                            value={formData.budget_min}
                                            onChange={handleChange}
                                            className="pl-13 pr-3 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">MWK</span>
                                        <Input
                                            type="number"
                                            name="budget_max"
                                            value={formData.budget_max}
                                            onChange={handleChange}
                                            className="pl-13 pr-3 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (Optional)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="pl-10 pr-4 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-er-primary/20 focus-visible:border-er-primary"
                                        placeholder="e.g. 3 months"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-3 pb-8 border-t border-gray-100">
                <Button
                    type="button"
                    variant="outline"
                    className=""
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className=""
                >
                    {isLoading ? 'Saving...' : (mode === 'create' ? 'Post Job' : 'Save Changes')}
                </Button>
            </div>
        </form>
    )
}
