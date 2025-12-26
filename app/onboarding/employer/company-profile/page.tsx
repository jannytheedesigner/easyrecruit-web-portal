"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axiosClient, { initCsrf } from "@/lib/axiosClient";
import { loadEmployerDraft, saveEmployerDraft, clearEmployerDraft, setEmployerLastStep } from "@/lib/onboardingProgress";

const steps = ["Company Info", "Company Profile", "Documents", "HR Contact", "Goals", "Preferences", "Confirm"];

export default function EmployerCompanyProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    logo_url: "",
    website: "",
    about: "",
    facebook_page: "",
    linkedin_page: "",
    company_size: "",
  });

  // Load draft and mark last step
  useEffect(() => {
    setEmployerLastStep("company-profile");
    const draft = loadEmployerDraft<typeof form>("company-profile");
    if (draft) setForm((p) => ({ ...p, ...draft }));
  }, []);

  // Persist draft on change
  useEffect(() => {
    saveEmployerDraft("company-profile", form);
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await initCsrf();
      await axiosClient.post("/onboarding/employer/company-profile", form, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""}`,
        },
      });
      clearEmployerDraft("company-profile");
      setEmployerLastStep("documents");
      router.push("/onboarding/employer/documents");
    } catch (err: any) {
      toast({ variant: "destructive", title: err?.response?.data?.message || "Failed to save profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center p-6">
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6">
            <ProgressIndicator steps={steps} current={1} />
            <div>
              <h1 className="text-3xl font-bold">Company profile & branding</h1>
              <p className="text-muted-foreground">Add branding, website and a short description.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Logo URL</Label>
                <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Website</Label>
                <Input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <Label>About</Label>
                <textarea
                  rows={4}
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label>Facebook Page</Label>
                <Input type="url" value={form.facebook_page} onChange={(e) => setForm({ ...form, facebook_page: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>LinkedIn Page</Label>
                <Input type="url" value={form.linkedin_page} onChange={(e) => setForm({ ...form, linkedin_page: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Company Size</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.company_size}
                  onChange={(e) => setForm({ ...form, company_size: e.target.value })}
                  required
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => router.push("/onboarding/employer/company-details")} className="rounded-full border border-slate-200 px-6 py-2 text-sm text-slate-700 hover:bg-slate-50">Back</button>
              <Button type="submit" disabled={loading} className="flex-1">{loading ? "Saving..." : "Continue"}</Button>
              <button
                type="button"
                onClick={() => { saveEmployerDraft("company-profile", form); toast({ title: "Draft saved" }); router.replace("/employer/dashboard"); }}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >Save & Exit</button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  );
}
