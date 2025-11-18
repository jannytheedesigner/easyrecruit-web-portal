"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import Image from "next/image"

export default function OnboardingCompletePage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    completeOnboarding()
  }, [])

  const completeOnboarding = async () => {
    try {
      await axiosClient.post("/onboarding/employer/confirm")
      await refreshUser()

      // Show completion screen for 3 seconds
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
    <OnboardingLayout>
      <div className="bg-white h-fit my-auto">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-fit px-4 my-auto">
        {/* Completion Illustration */}
        <div className="mb-8">
          <div className="relative">

            {/* Illustration placeholder - using simple shapes */}
            <div className="w-64 h-64 flex items-center justify-center">
              <Image src="/brand-assets/visual-assets/illustrations/employer-onboard.svg" alt="Employer Illustration" width="400" height="500" className="mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-4">You're all set!</h1>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-green-500 transition-all duration-1000 ${loading ? "w-0" : "w-full"}`} />
          </div>
        </div>

        {!loading && (
          <>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Your EasyRecruit employer dashboard is ready. Start posting jobs or exploring talent.
            </p>

            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-er-primary text-sm text-white rounded-full font-semibold hover:bg-[#0a1570] transition-colors text-lg"
            >
              Continue to Dashboard
            </button>
          </>
        )}

        {loading && <p className="text-gray-600 text-center">Setting up your dashboard...</p>}
      </div>
      </div>
    </OnboardingLayout>
  )
}
