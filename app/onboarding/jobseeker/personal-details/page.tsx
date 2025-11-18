"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import { toast } from "@/components/ui/use-toast"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import { useAuth } from "@/hooks/useAuth"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"

export default function JobseekerPersonalDetailsPage() {
  const router = useRouter()
  const { user, loading: authLoading, checkOnboarding } = useAuth()

  const steps = ["Personal Info", "Education Background", "Skills & Interest", "Work Experience", "Documents", "Referees"]


  const [form, setForm] = useState({
    national_id: "",
    gender: "",
    date_of_birth: "",
    phone_primary: "",
    phone_secondary: "",
    district: "",
    town: "",
    willing_to_relocate: false as boolean,
    preferred_location: "",
    current_job_title: "",
    current_status: "",
    experience_years: "",
    expected_salary: "",
    languages: [] as string[],
    driving_license: "",
    profile_picture: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [languageInput, setLanguageInput] = useState("")

  // ✅ Load existing onboarding data (if user previously saved it)
  useEffect(() => {
    if (authLoading || !user) return

    const loadExistingData = async () => {
      try {
        await initCsrf()
        const res = await axiosClient.get("/onboarding/jobseeker/basic-details", {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
            }`,
          },
        })

        if (res.data?.jobseeker) {
          const data = res.data.jobseeker
          setForm((prev) => ({
            ...prev,
            ...data,
            languages: Array.isArray(data.languages)
              ? data.languages
              : data.languages
              ? JSON.parse(data.languages)
              : [],
          }))
        }
      } catch (err) {
        console.warn("No saved onboarding data found, starting fresh.")
      } finally {
        setInitialLoading(false)
      }
    }

    loadExistingData()
  }, [authLoading, user])

  // ✅ Redirect logic
  useEffect(() => {
    if (authLoading || !user) return

    checkOnboarding()
      .then((completed) => {
        if (completed) router.replace("/dashboard")
        else if (user.role === "employer")
          router.replace("/onboarding/employer/company-details")
      })
      .catch(() => {})
  }, [authLoading, user, checkOnboarding, router])

  // ✅ Input handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const addLanguage = () => {
    if (languageInput.trim() !== "" && !form.languages.includes(languageInput.trim())) {
      setForm((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }))
      setLanguageInput("")
    }
  }

  const removeLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await initCsrf()
      await axiosClient.post("/onboarding/jobseeker/basic-details", form, {
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
          }`,
        },
      })
      router.replace("/onboarding/jobseeker/education")
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error?.response?.data?.message || "Please check your input",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <OnboardingLayout>
        <div className="flex items-center justify-center h-[70vh] text-slate-500 text-sm">
          Loading your details...
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-5xl mx-auto">
            <ProgressIndicator
              steps={steps}
              current={0}
            />

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                Tell us a bit about yourself
              </h1>
              <p className="text-slate-500 text-sm">
                This helps us match you with employers
              </p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Full Name</span>
                <input
                  name="name"
                  value={user?.name || ""}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm bg-slate-50"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">National ID</span>
                <input
                  name="national_id"
                  value={form.national_id || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Gender</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Date of Birth</span>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Primary Phone</span>
                <input
                  name="phone_primary"
                  value={form.phone_primary}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Secondary Phone</span>
                <input
                  name="phone_secondary"
                  value={form.phone_secondary}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">District</span>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Town / Trading Centre</span>
                <input
                  name="town"
                  value={form.town}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
            </div>

            {/* Relocation */}
            <div className="flex items-center gap-3 mb-7">
              <input
                type="checkbox"
                name="willing_to_relocate"
                checked={form.willing_to_relocate}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Willing to relocate?</span>
            </div>

            <label className="block mb-7">
              <span className="text-sm text-slate-700 mb-1 block">Preferred Work Location</span>
              <input
                name="preferred_location"
                value={form.preferred_location}
                onChange={handleChange}
                placeholder="e.g., Lilongwe, Blantyre, etc."
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
              />
            </label>

            {/* Professional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Current Job Title</span>
                <input
                  name="current_job_title"
                  value={form.current_job_title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Current Status</span>
                <select
                  name="current_status"
                  value={form.current_status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                </select>
              </label>
            </div>

            {/* Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Years of Experience</span>
                <input
                  type="number"
                  name="experience_years"
                  value={form.experience_years}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Expected Salary (MWK)</span>
                <input
                  type="number"
                  name="expected_salary"
                  value={form.expected_salary}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
              </label>
            </div>

            {/* Languages */}
            <div className="mb-7">
              <span className="text-sm text-slate-700 mb-1 block">Languages</span>
              <div className="flex gap-2 mb-2">
                <input
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  placeholder="Add a language"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="rounded-full bg-er-primary text-white px-4 py-2 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.languages.map((lang) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-slate-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Driving License */}
            <label className="block mb-7">
              <span className="text-sm text-slate-700 mb-1 block">Driving License</span>
              <input
                name="driving_license"
                value={form.driving_license}
                onChange={handleChange}
                placeholder="e.g., Class B"
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
              />
            </label>

            {/* Profile Picture */}
            <label className="block mb-10">
              <span className="text-sm text-slate-700 mb-1 block">Profile Picture URL</span>
              <input
                name="profile_picture"
                value={form.profile_picture}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                placeholder="https://..."
              />
            </label>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.replace("/onboarding/jobseeker/welcome")}
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
