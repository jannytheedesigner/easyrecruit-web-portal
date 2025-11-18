"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "@/components/Loader"

interface EducationItem {
  id?: number
  level: string
  qualification: string
  institution: string
  year_completed: string
  certificate_url: string
}

export default function JobseekerEducationPage() {
  const router = useRouter()
  const [educations, setEducations] = useState<EducationItem[]>([
    { level: "", qualification: "", institution: "", year_completed: "", certificate_url: "" },
  ])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const steps = ["Personal", "Education", "Experience", "Skills & Interests", "Documents", "Referees", "Complete"]

  // ✅ Fetch previously saved education details
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        await initCsrf()
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
        const res = await axiosClient.get("/onboarding/jobseeker/education-background", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const list = res.data?.educations || []
        if (list.length > 0) {
          setEducations(
            list.map((edu: any) => ({
              id: edu.id,
              level: edu.level || "",
              qualification: edu.qualification || "",
              institution: edu.institution || "",
              year_completed: edu.year_completed?.toString() || "",
              certificate_url: edu.certificate_url || "",
            }))
          )
        }
      } catch (err) {
        console.log("No education data found — starting new onboarding step.")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchEducationData()
  }, [])

  // ✅ Handle field change
  const handleChange = (index: number, key: keyof EducationItem, value: string) => {
    setEducations((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [key]: value } : e))
    )
  }

  // ✅ Add or remove education
  const addEducation = () =>
    setEducations((prev) => [
      ...prev,
      { level: "", qualification: "", institution: "", year_completed: "", certificate_url: "" },
    ])

  const removeEducation = (i: number) =>
    setEducations((prev) => prev.filter((_, idx) => idx !== i))

  // ✅ Submit and save
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await initCsrf()
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""

      await axiosClient.post(
        "/onboarding/jobseeker/education-background",
        { educations },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({ title: "Education saved successfully", variant: "default" })
      router.replace("/onboarding/jobseeker/work-experience")
    } catch (error: any) {
      toast({
        title: "Failed to save education",
        description: error?.response?.data?.message || "Please check your inputs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <OnboardingLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500 text-sm">
          <Loader size="md" />
          <p className="mt-2">Loading your saved education details...</p>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-5xl mx-auto">
            <ProgressIndicator steps={steps} current={1} />

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                Your Education Background
              </h1>
              <p className="text-slate-500 text-sm">
                Add all relevant qualifications — they’ll help employers match you to the right roles.
              </p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            <div className="space-y-6">
              {educations.map((edu, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-5 shadow-sm bg-white/60 backdrop-blur-sm transition hover:border-er-primary/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-medium text-slate-800">
                      Qualification {i + 1}
                    </h2>
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(i)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Level</span>
                      <select
                        value={edu.level}
                        onChange={(e) => handleChange(i, "level", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:ring-1 focus:ring-er-primary/40 focus:outline-none"
                      >
                        <option value="">Select Level</option>
                        <option value="MSCE">MSCE</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Degree">Degree</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Qualification</span>
                      <input
                        value={edu.qualification}
                        onChange={(e) => handleChange(i, "qualification", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:ring-1 focus:ring-er-primary/40 focus:outline-none"
                        placeholder="e.g., Diploma in ICT"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Institution</span>
                      <input
                        value={edu.institution}
                        onChange={(e) => handleChange(i, "institution", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:ring-1 focus:ring-er-primary/40 focus:outline-none"
                        placeholder="e.g., MUBAS University"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Year Completed</span>
                      <input
                        type="number"
                        value={edu.year_completed}
                        onChange={(e) => handleChange(i, "year_completed", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:ring-1 focus:ring-er-primary/40 focus:outline-none"
                        placeholder="e.g., 2023"
                        min={1950}
                        max={2100}
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="text-sm text-slate-700 mb-1 block">
                        Certificate URL (optional)
                      </span>
                      <input
                        type="url"
                        value={edu.certificate_url}
                        onChange={(e) => handleChange(i, "certificate_url", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-er-primary focus:ring-1 focus:ring-er-primary/40 focus:outline-none"
                        placeholder="https://..."
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-start mt-6">
              <button
                type="button"
                onClick={addEducation}
                className="px-5 py-2 text-er-primary text-sm font-medium hover:underline"
              >
                + Add Another Qualification
              </button>
            </div>

            <div className="flex items-center justify-between pt-10">
              <button
                type="button"
                onClick={() => router.replace("/onboarding/jobseeker/basic-details")}
                className="rounded-full border border-slate-200 px-8 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-er-primary px-10 py-2.5 text-sm text-white font-medium hover:bg-er-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader size="sm" />}
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}
