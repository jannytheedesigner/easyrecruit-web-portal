"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import Link from "next/link"

export default function JobPreferencesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    job_type: [] as string[],
    expected_salary_min: "",
    expected_salary_max: "",
    availability: "",
  })

  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ]

  const availabilityOptions = [
    { value: "immediate", label: "Immediately" },
    { value: "2-weeks", label: "Within 2 weeks" },
    { value: "1-month", label: "Within 1 month" },
    { value: "flexible", label: "Flexible" },
  ]

  const toggleJobType = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      job_type: prev.job_type.includes(value) ? prev.job_type.filter((t) => t !== value) : [...prev.job_type, value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await axiosClient.post("/onboarding/jobseeker/job-preferences", formData)
      router.push("/onboarding/jobseeker/upload-cv")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save job preferences")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d1b8c] rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">e</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">EasyJobSeeker</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Having Trouble?</span>
          <Link href="/help" className="text-[#0d1b8c] font-semibold hover:underline">
            Get Help
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-4xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-600">3 / 5</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0d1b8c] transition-all duration-300" style={{ width: "60%" }} />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What are your job preferences?</h1>
            <p className="text-gray-600">Help us match you with the right opportunities</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Preferred Job Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jobTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleJobType(type.value)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.job_type.includes(type.value)
                        ? "border-[#0d1b8c] bg-blue-50 text-[#0d1b8c]"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Expected Salary Range <span className="text-gray-400">(optional)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={formData.expected_salary_min}
                    onChange={(e) => setFormData({ ...formData, expected_salary_min: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d1b8c] focus:border-transparent"
                    placeholder="Minimum (USD)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.expected_salary_max}
                    onChange={(e) => setFormData({ ...formData, expected_salary_max: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d1b8c] focus:border-transparent"
                    placeholder="Maximum (USD)"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">When can you start?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availabilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, availability: option.value })}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.availability === option.value
                        ? "border-[#0d1b8c] bg-blue-50 text-[#0d1b8c]"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/onboarding/jobseeker/upload-cv")}
                  className="px-6 py-3 text-[#0d1b8c] font-semibold hover:underline"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#0d1b8c] text-white rounded-full font-semibold hover:bg-[#0a1570] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
