"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function JobseekerOnboardingCompletePage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    completeOnboarding()
  }, [])

  const completeOnboarding = async () => {
    try {
      await axiosClient.post("/onboarding/jobseeker/confirm")
      await refreshUser()

      // Show completion screen for 2 seconds
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Completion Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Badge */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d1b8c] text-white px-4 py-1 rounded-full text-sm font-semibold">
              COMPLETED
            </div>

            {/* Illustration */}
            <div className="w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Person sitting */}
                <circle cx="100" cy="80" r="20" fill="#0d1b8c" />
                <rect x="85" y="100" width="30" height="40" rx="5" fill="#0d1b8c" />
                <rect x="70" y="140" width="60" height="8" rx="4" fill="#94a3b8" />

                {/* Laptop */}
                <rect x="80" y="120" width="40" height="25" rx="2" fill="#e2e8f0" stroke="#0d1b8c" strokeWidth="2" />

                {/* Checkmark */}
                <circle cx="140" cy="70" r="15" fill="#10b981" />
                <path d="M 135 70 L 138 73 L 145 66" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Plant */}
                <ellipse cx="160" cy="150" rx="8" ry="12" fill="#10b981" />
                <rect x="158" y="150" width="4" height="20" fill="#0d1b8c" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">You're all set!</h1>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-green-500 transition-all duration-1000 ${loading ? "w-0" : "w-full"}`} />
          </div>
        </div>

        {!loading && (
          <>
            <p className="text-gray-600 text-center mb-8 max-w-md">Getting Jobs Posts and Job Seekers for you</p>

            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-[#0d1b8c] text-white rounded-full font-semibold hover:bg-[#0a1570] transition-colors text-lg"
            >
              Continue to Dashboard
            </button>
          </>
        )}

        {loading && <p className="text-gray-600 text-center">Setting up your profile...</p>}
      </div>

      {/* Footer Pattern */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
            <text x="20" y="60" fontSize="80" fill="#e5e7eb" opacity="0.3" fontWeight="bold">
              e
            </text>
          </pattern>
          <rect width="1440" height="100" fill="url(#pattern)" />
        </svg>
      </div>
    </div>
  )
}
