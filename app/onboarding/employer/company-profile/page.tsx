"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import { loadEmployerDraft, saveEmployerDraft, clearEmployerDraft, setEmployerLastStep } from "@/lib/onboardingProgress"

const steps = ["Basic Info", "Company Profile", "Documents", "HR Contact", "Hiring Goals", "Preferences", "Confirm"]

export default function EmployerCompanyProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    // Basic Info (already saved in step 1, but kept here for draft context)
    company_name: "",
    company_type: "",
    registration_number: "",
    tpin_number: "",
    industry: "",
    district: "",
    address: "",
    phone: "",
    email: "",
    // Profile & Branding
    logo_url: "",
    website: "",
    about: "",
    facebook_page: "",
    linkedin_page: "",
    company_size: "",
  })

  // Load draft on mount
  useEffect(() => {
    setEmployerLastStep("company-profile")
    const draft = loadEmployerDraft<typeof form>("company-profile")
    if (draft) setForm((p) => ({ ...p, ...draft }))
  }, [])

  // Persist draft on change
  useEffect(() => {
    saveEmployerDraft("company-profile", form)
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await initCsrf()
      
      await axiosClient.post("/onboarding/employer/company-profile", {
        logo_url: form.logo_url,
        website: form.website,
        about: form.about,
        facebook_page: form.facebook_page,
        linkedin_page: form.linkedin_page,
        company_size: form.company_size,
      })

      clearEmployerDraft("company-profile")
      setEmployerLastStep("documents" as any)
      router.push("/onboarding/employer/documents")
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Failed to save profile",
        description: err?.response?.data?.message || "Please check your input"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center p-6">
          <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-10">
            <ProgressIndicator steps={steps} current={0} />
            
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Company Profile & Branding</h1>
              <p className="text-slate-600">Tell us about your company to help candidates understand your mission and culture.</p>
            </div>

            {/* Basic Information Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input id="company_name" name="company_name" value={form.company_name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_type">Company Type</Label>
                  <select
                    id="company_type"
                    name="company_type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-er-primary"
                    value={form.company_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="private">Private Limited</option>
                    <option value="public">Public Limited</option>
                    <option value="ngo">NGO</option>
                    <option value="govt">Government</option>
                    <option value="school">Educational Institution</option>
                    <option value="church">Faith-based Organisation</option>
                    <option value="consultancy">Consultancy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input id="registration_number" name="registration_number" value={form.registration_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tpin_number">TPIN Number</Label>
                  <Input id="tpin_number" name="tpin_number" value={form.tpin_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" value={form.industry} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_size">Company Size</Label>
                  <select
                    id="company_size"
                    name="company_size"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-er-primary"
                    value={form.company_size}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Contact Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Location & Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" name="district" value={form.district} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website URL (Optional)</Label>
                  <Input id="website" name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://www.example.com" />
                </div>
              </div>
            </div>

            {/* Branding & About Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Branding & About</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Company Logo URL</Label>
                  <Input id="logo_url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="Link to your hosted logo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About the Company</Label>
                  <textarea
                    id="about"
                    name="about"
                    rows={5}
                    value={form.about}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-er-primary outline-none transition-all"
                    placeholder="Describe your company's mission, values, and culture..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_page">Facebook Page (Optional)</Label>
                    <Input id="facebook_page" name="facebook_page" type="url" value={form.facebook_page} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_page">LinkedIn Page (Optional)</Label>
                    <Input id="linkedin_page" name="linkedin_page" type="url" value={form.linkedin_page} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()} 
                className="rounded-full px-8 py-6 h-auto"
              >
                Back
              </Button>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { 
                    saveEmployerDraft("company-profile", form)
                    toast({ title: "Draft saved" })
                    router.replace("/employer/dashboard")
                  }}
                  className="rounded-full px-8 py-6 h-auto"
                >
                  Save & Exit
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="rounded-full px-12 py-6 h-auto bg-er-primary hover:bg-er-primary/90 text-white shadow-lg shadow-er-primary/20 transition-all font-semibold"
                >
                  {loading ? "Saving Profile..." : "Next: Contact Info"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}
