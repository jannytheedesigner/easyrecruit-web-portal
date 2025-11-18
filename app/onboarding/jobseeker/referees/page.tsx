"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "@/components/Loader"
import { UserCircle2, Trash2 } from "lucide-react"

interface RefereeItem {
  id?: number
  name: string
  position: string
  organisation: string
  phone: string
  email: string
}

export default function JobseekerRefereesPage() {
  const router = useRouter()
  const [referees, setReferees] = useState<RefereeItem[]>([
    { name: "", position: "", organisation: "", phone: "", email: "" },
    { name: "", position: "", organisation: "", phone: "", email: "" },
  ])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const steps = [
    "Personal Info",
    "Education Background",
    "Work Experience",
    "Skills & Interests",
    "Documents",
    "Referees",
  ]

  // ✅ Load existing referees from backend
  useEffect(() => {
    const fetchReferees = async () => {
      try {
        await initCsrf()
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
        const res = await axiosClient.get("/onboarding/jobseeker/referees", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const list = res.data?.referees || []
        if (list.length > 0) {
          setReferees(
            list.map((r: any) => ({
              id: r.id,
              name: r.name || "",
              position: r.position || "",
              organisation: r.organisation || "",
              phone: r.phone || "",
              email: r.email || "",
            }))
          )
        }
      } catch (err) {
        console.log("No referees found — starting new step.")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchReferees()
  }, [])

  const handleChange = (i: number, key: keyof RefereeItem, value: string) => {
    setReferees((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))
  }

  const addReferee = () =>
    setReferees((prev) => [
      ...prev,
      { name: "", position: "", organisation: "", phone: "", email: "" },
    ])

  const removeReferee = (i: number) =>
    setReferees((prev) => prev.filter((_, idx) => idx !== i))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (referees.filter((r) => r.name.trim() !== "").length < 2) {
      toast({ title: "Please add at least two referees.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await initCsrf()
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
      await axiosClient.post(
        "/onboarding/jobseeker/referees",
        { referees },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({
        title: "Referees saved successfully!",
        description: "You're one step closer to completing your profile.",
      })
      router.replace("/onboarding/jobseeker/complete")
    } catch (err: any) {
      toast({
        title: "Failed to save referees",
        description: err?.response?.data?.message || "Please check your input and try again.",
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
          <p className="mt-2">Loading your referees...</p>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-5xl mx-auto">
            <ProgressIndicator steps={steps} current={5} />

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                Add at least two referees
              </h1>
              <p className="text-slate-500 text-sm">
                Include people who can professionally vouch for your work or academic performance.
              </p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            <div className="space-y-6">
              {referees.map((r, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-5 shadow-sm bg-white/70 backdrop-blur-sm transition hover:border-er-primary/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="w-5 h-5 text-er-primary" />
                      <h2 className="text-base font-medium text-slate-800">
                        Referee {i + 1}
                      </h2>
                    </div>
                    {referees.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeReferee(i)}
                        className="text-xs text-red-500 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Full Name</span>
                      <input
                        value={r.name}
                        onChange={(e) => handleChange(i, "name", e.target.value)}
                        placeholder="e.g., John Banda"
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:ring-1 focus:ring-er-primary/40 focus:border-er-primary focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Position</span>
                      <input
                        value={r.position}
                        onChange={(e) => handleChange(i, "position", e.target.value)}
                        placeholder="e.g., Senior Manager"
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:ring-1 focus:ring-er-primary/40 focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Organisation</span>
                      <input
                        value={r.organisation}
                        onChange={(e) => handleChange(i, "organisation", e.target.value)}
                        placeholder="e.g., Cool Enterprises Ltd."
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:ring-1 focus:ring-er-primary/40 focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-slate-700 mb-1 block">Phone</span>
                      <input
                        value={r.phone}
                        onChange={(e) => handleChange(i, "phone", e.target.value)}
                        placeholder="e.g., +265 991 234 567"
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:ring-1 focus:ring-er-primary/40 focus:border-er-primary focus:outline-none"
                      />
                    </label>
                    <label className="md:col-span-2 block">
                      <span className="text-sm text-slate-700 mb-1 block">Email Address</span>
                      <input
                        type="email"
                        value={r.email}
                        onChange={(e) => handleChange(i, "email", e.target.value)}
                        placeholder="e.g., john@example.com"
                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:ring-1 focus:ring-er-primary/40 focus:border-er-primary focus:outline-none"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-start mt-6">
              <button
                type="button"
                onClick={addReferee}
                className="px-5 py-2 text-er-primary text-sm font-medium hover:underline"
              >
                + Add Another Referee
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-10">
              <button
                type="button"
                onClick={() => router.replace("/onboarding/jobseeker/documents")}
                className="rounded-full border border-slate-200 px-8 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-er-primary px-10 py-2.5 text-sm text-white font-medium hover:bg-er-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? <Loader size="sm" /> : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}
