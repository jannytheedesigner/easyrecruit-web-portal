"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { X, PlusCircle } from "lucide-react"

interface Skill {
  id: number
  name: string
}

interface Interest {
  id: number
  name: string
}

interface JobCategory {
  id: number
  name: string
}

export default function SkillsJobCategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [skills, setSkills] = useState<
    { id: number | ""; proficiency_level: "beginner" | "intermediate" | "expert"; years_of_experience: number | "" }[]
  >([{ id: "", proficiency_level: "beginner", years_of_experience: "" }])
  const [interests, setInterests] = useState<number[]>([])
  const [jobCategories, setJobCategories] = useState<number[]>([])

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([])
  const [availableJobCategories, setAvailableJobCategories] = useState<JobCategory[]>([])

  const steps = ["Personal Info", "Education Background", "Skills & Interest", "Work Experience", "Documents", "Referees"]

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [skillsRes, interestsRes, categoriesRes] = await Promise.all([
          axiosClient.get("/easydata/skills"),
          axiosClient.get("/easydata/interests"),
          axiosClient.get("/easydata/categories"),
        ])
        setAvailableSkills(skillsRes.data.data || skillsRes.data)
        setAvailableInterests(interestsRes.data.data || interestsRes.data)
        setAvailableJobCategories(categoriesRes.data.data || categoriesRes.data)
      } catch (err: any) {
        console.error("Failed to load options", err)
      }
    }
    fetchLists()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await initCsrf()

      const normalizedSkills = skills
        .filter((s) => s.id !== "" && s.years_of_experience !== "")
        .map((s) => ({
          id: Number(s.id),
          proficiency_level: s.proficiency_level,
          years_of_experience: Number(s.years_of_experience),
        }))

      if (normalizedSkills.length === 0) {
        setError("Please add at least one skill with proficiency and years of experience.")
        setLoading(false)
        return
      }

      await axiosClient.post("/onboarding/jobseeker/skills-and-interests", {
        skills: normalizedSkills,
        interests,
        job_categories: jobCategories,
      })

      router.push("/onboarding/jobseeker/documents")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to save skills and interests.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout>
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <ProgressIndicator steps={steps} current={3} />

          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Add Your Skills & Interests</h1>
            <p className="text-slate-600">Select your professional skills, preferred categories, and interests. These will help us match you with the right opportunities.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Job Categories */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Job Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableJobCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setJobCategories((prev) =>
                        prev.includes(category.id)
                          ? prev.filter((id) => id !== category.id)
                          : [...prev, category.id]
                      )
                    }
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${jobCategories.includes(category.id)
                      ? "bg-er-primary text-white border-er-primary"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              {jobCategories.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">Select at least one category.</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-slate-700">Skills</h2>
                <button
                  type="button"
                  onClick={() => setSkills((prev) => [...prev, { id: "", proficiency_level: "beginner", years_of_experience: "" }])}
                  className="text-sm text-er-primary font-medium flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Skill
                </button>
              </div>

              <div className="space-y-4">
                {skills.map((s, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                  >
                    <select
                      value={s.id}
                      onChange={(e) => {
                        const v = e.target.value === "" ? "" : Number(e.target.value)
                        setSkills((prev) => prev.map((x, i) => (i === idx ? { ...x, id: v } : x)))
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-er-primary"
                    >
                      <option value="">Select Skill</option>
                      {availableSkills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-er-primary"
                      value={s.proficiency_level}
                      onChange={(e) =>
                        setSkills((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, proficiency_level: e.target.value as any } : x
                          )
                        )
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>

                    <input
                      type="number"
                      min={0}
                      placeholder="Years of Experience"
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-er-primary"
                      value={s.years_of_experience as any}
                      onChange={(e) => {
                        const v = e.target.value === "" ? "" : Number(e.target.value)
                        setSkills((prev) => prev.map((x, i) => (i === idx ? { ...x, years_of_experience: v } : x)))
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setSkills((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Interests</label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((int) => (
                  <button
                    key={int.id}
                    type="button"
                    onClick={() =>
                      setInterests((prev) =>
                        prev.includes(int.id)
                          ? prev.filter((id) => id !== int.id)
                          : [...prev, int.id]
                      )
                    }
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${interests.includes(int.id)
                      ? "bg-er-complimentary text-white border-er-complimentary"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {int.name}
                  </button>
                ))}
              </div>
              {interests.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">You can select multiple interests.</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-er-primary text-white rounded-full font-semibold hover:bg-er-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? (
                  <>

                    <span>Saving...</span>
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  )
}
