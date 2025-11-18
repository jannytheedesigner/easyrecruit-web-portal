// app/onboarding/employer/company-details/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import axiosClient from "@/lib/axiosClient";
import { initCsrf } from "@/lib/axiosClient";
import { toast } from "@/components/ui/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  loadEmployerDraft,
  saveEmployerDraft,
  clearEmployerDraft,
  setEmployerLastStep,
} from "@/lib/onboardingProgress";

const steps = ["Company Info", "Company Profile", "Documents", "HR Contact", "Goals", "Preferences", "Confirm"];

export default function CompanyDetails() {
  const [form, setForm] = useState({
    company_name: "",
    company_type: "",
    registration_number: "",
    tpin_number: "",
    industry: "",
    district: "",
    address: "",
    phone: "",
    email: "",
  });
  const router = useRouter();

  // Load draft and mark last step on mount
  useEffect(() => {
    setEmployerLastStep("company-details");
    const draft = loadEmployerDraft<typeof form>("company-details");
    if (draft) setForm((p) => ({ ...p, ...draft }));
  }, []);

  // Persist draft on change
  useEffect(() => {
    saveEmployerDraft("company-details", form);
  }, [form]);

  const handleSubmit = async () => {
    try {
      await initCsrf();
      await axiosClient.post("/onboarding/employer/basic-info", form, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""}`,
        },
      });
      toast({ title: "Basic information saved" });
      clearEmployerDraft("company-details");
      setEmployerLastStep("company-profile");
      router.push("/onboarding/employer/company-profile");
    } catch {
      toast({ variant: "destructive", title: "Failed to save" });
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center my-auto">
          
          <div className="w-full max-w-5xl space-y-6">
            <ProgressIndicator steps={steps} current={0} />
            <div>
              <h1 className="text-3xl font-bold">Basic company information</h1>
              <p className="text-muted-foreground">This helps us set up your employer profile.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label>Company Name</Label>
                  <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Company Type</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.company_type}
                    onChange={(e) => setForm({ ...form, company_type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="private">Private</option>
                    <option value="ngo">NGO</option>
                    <option value="govt">Government</option>
                    <option value="school">School</option>
                    <option value="church">Church</option>
                    <option value="consultancy">Consultancy</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <Label>Registration Number</Label>
                  <Input value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>TPIN Number</Label>
                  <Input value={form.tpin_number} onChange={(e) => setForm({ ...form, tpin_number: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Industry</Label>
                  <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>District</Label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <Button onClick={handleSubmit} className="flex-1">
                Continue
              </Button>
              <button
                type="button"
                onClick={() => {
                  saveEmployerDraft("company-details", form);
                  toast({ title: "Draft saved" });
                  router.replace("/dashboard");
                }}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  );
}