"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { toast } from "@/components/ui/use-toast"


interface ExperienceItem {
  organisation: string
  role: string
  start_date: string
  end_date: string
  present: boolean
  contract_type: "full-time" | "internship" | "volunteer"
  description: string
}

export default function JobseekerSkillsExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { organisation: "", role: "", start_date: "", end_date: "", present: false, contract_type: "full-time", description: "" },
  ])

  const steps = ["Personal Info", "Education Background", "Skills & Interest", "Work Experience", "Documents", "Referees"]


  const handleExperienceChange = (i: number, key: keyof ExperienceItem, value: any) => {
    setExperiences((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)))
  }

  const addExperience = () =>
    setExperiences((prev) => [
      ...prev,
      { organisation: "", role: "", start_date: "", end_date: "", present: false, contract_type: "full-time", description: "" },
    ])

  const removeExperience = (i: number) => setExperiences((prev) => prev.filter((_, idx) => idx !== i))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await initCsrf()
      await axiosClient.post("/onboarding/jobseeker/work-experience", {
        experiences: experiences.map((e) => ({
          organisation: e.organisation,
          role: e.role,
          start_date: e.start_date,
          end_date: e.present ? null : e.end_date,
          contract_type: e.contract_type,
          description: e.description,
        })),
      })
      router.replace("/onboarding/jobseeker/skills-and-interest")
    } catch (err: any) {
      toast({ title: "Failed to save skills & experience", description: err?.response?.data?.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-4xl mx-auto">
            <ProgressIndicator steps={steps} current={2} />

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-1 capitalize">Your work experience</h1>
              <p className="text-slate-500 text-sm">Add your previous roles to make your profile discoverable.</p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {/* Experience */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-slate-700">Work Experience</label>
                <button type="button" onClick={addExperience} className="px-4 py-2 text-er-primary text-sm hover:underline">
                  Add Another Experience
                </button>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Organisation</span>
                      <input
                        value={exp.organisation}
                        onChange={(e) => handleExperienceChange(i, "organisation", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Role / Position</span>
                      <input
                        value={exp.role}
                        onChange={(e) => handleExperienceChange(i, "role", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Start Date</span>
                      <input
                        type="date"
                        value={exp.start_date}
                        onChange={(e) => handleExperienceChange(i, "start_date", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">End Date</span>
                      <input
                        type="date"
                        value={exp.end_date}
                        onChange={(e) => handleExperienceChange(i, "end_date", e.target.value)}
                        disabled={exp.present}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none disabled:opacity-50"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.present}
                        onChange={(e) => handleExperienceChange(i, "present", e.target.checked)}
                      />
                      <span className="text-sm text-slate-700">Present</span>
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Contract Type</span>
                      <select
                        value={exp.contract_type}
                        onChange={(e) => handleExperienceChange(i, "contract_type", e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="internship">Internship</option>
                        <option value="volunteer">Volunteer</option>
                      </select>
                    </label>
                    <label className="md:col-span-2 block">
                      <span className="text-sm text-slate-700 mb-1 block">Description</span>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(i, "description", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:outline-none"
                      />
                    </label>
                  </div>
                  {experiences.length > 1 && (
                    <div className="flex justify-end mt-3">
                      <button type="button" onClick={() => removeExperience(i)} className="text-sm text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-full border border-slate-200 px-8 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-er-primary px-10 py-2.5 text-sm text-white font-medium hover:bg-er-primary/90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}
