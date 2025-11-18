"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import { toast } from "@/components/ui/use-toast"
import OnboardingLayout from "@/components/layout/OnboardingLayout"

export default function JobseekerPortfolioPreferencesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([""])
  const [cvUrl, setCvUrl] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [availability, setAvailability] = useState<"full-time" | "part-time" | "contract" | "flexible">("full-time")
  const [interests, setInterests] = useState<string>("")

  const addPortfolio = () => {
    if (portfolioUrls.length >= 5) return
    setPortfolioUrls((p) => [...p, ""])
  }
  const updatePortfolio = (i: number, v: string) => {
    setPortfolioUrls((p) => p.map((x, idx) => (idx === i ? v : x)))
  }
  const removePortfolio = (i: number) => {
    setPortfolioUrls((p) => p.filter((_, idx) => idx !== i))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await initCsrf()
      const payload = {
        portfolio_urls: portfolioUrls.map((u) => u.trim()).filter(Boolean),
        cv_url: cvUrl || null,
        remote_only: remoteOnly,
        availability,
        interests: interests
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => Number(v)),
      }
      await axiosClient.post("/onboarding/jobseeker/portfolio-preferences", payload)
      toast({ title: "Onboarding complete" })
      router.replace("/onboarding/jobseeker/complete")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save portfolio & preferences")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center p-4">
          <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-1">Portfolio & Preferences</h1>
              <p className="text-slate-500 text-sm">Share your work and set availability</p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            {error && (
              <div className="p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="block text-sm text-slate-700 mb-2">Portfolio URLs (up to 5)</label>
              <div className="space-y-2">
                {portfolioUrls.map((u, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      value={u}
                      placeholder="https://..."
                      onChange={(e) => updatePortfolio(i, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    />
                    <button type="button" onClick={() => removePortfolio(i)} className="text-sm text-slate-500">
                      Remove
                    </button>
                  </div>
                ))}
                {portfolioUrls.length < 5 && (
                  <button type="button" onClick={addPortfolio} className="text-sm text-brand">
                    + Add another URL
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">CV URL (optional)</span>
                <input
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 mt-6 md:mt-0">
                <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
                <span className="text-sm text-slate-700">Remote only</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Availability</span>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="flexible">Flexible</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-700 mb-1 block">Interest IDs (comma separated)</span>
                <input
                  type="text"
                  value={interests}
                  placeholder="e.g., 2, 4, 7"
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => history.back()}
                className="rounded-full border border-slate-200 px-8 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-brand px-10 py-2.5 text-sm text-white font-medium hover:bg-brand/90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Finish"}
              </button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}

