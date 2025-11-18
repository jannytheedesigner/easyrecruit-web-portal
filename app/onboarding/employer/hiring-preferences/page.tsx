"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axiosClient, { initCsrf } from "@/lib/axiosClient";

const steps = ["Company Info", "Company Profile", "Documents", "HR Contact", "Hiring Goals", "Preferences", "Confirm"];

export default function EmployerHiringPreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    open_to_remote: false,
    can_hire_interns: false,
    can_hire_graduates: false,
    hiring_preferences: [""] as string[],
  });

  const setPref = (i: number, v: string) => setForm((p) => ({ ...p, hiring_preferences: p.hiring_preferences.map((x, idx) => (idx === i ? v : x)) }));
  const addPref = () => setForm((p) => ({ ...p, hiring_preferences: [...p.hiring_preferences, ""] }));
  const removePref = (i: number) => setForm((p) => ({ ...p, hiring_preferences: p.hiring_preferences.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await initCsrf();
      const payload = {
        open_to_remote: form.open_to_remote,
        can_hire_interns: form.can_hire_interns,
        can_hire_graduates: form.can_hire_graduates,
        hiring_preferences: form.hiring_preferences.map((s) => s.trim()).filter(Boolean),
      };
      await axiosClient.post("/onboarding/employer/hiring-preferences", payload);
      router.push("/onboarding/employer/complete");
    } catch (err: any) {
      toast({ variant: "destructive", title: err?.response?.data?.message || "Failed to save preferences" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center my-auto p-6">
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6">
            <ProgressIndicator steps={steps} current={5} />
            <div>
              <h1 className="text-3xl font-bold">Hiring preferences</h1>
              <p className="text-muted-foreground">Tell us how you prefer to hire.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.open_to_remote}
                  onChange={(e) => setForm({ ...form, open_to_remote: e.target.checked })}
                />
                <span>Open to remote work</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.can_hire_interns}
                  onChange={(e) => setForm({ ...form, can_hire_interns: e.target.checked })}
                />
                <span>Can hire interns</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.can_hire_graduates}
                  onChange={(e) => setForm({ ...form, can_hire_graduates: e.target.checked })}
                />
                <span>Can hire fresh graduates</span>
              </label>
            </div>

            <div className="space-y-3">
              <Label>Other preferences (optional)</Label>
              {form.hiring_preferences.map((pref, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-3">
                  <Input placeholder="e.g., Prefer onsite interviews" value={pref} onChange={(e) => setPref(i, e.target.value)} />
                  {form.hiring_preferences.length > 1 && (
                    <button type="button" onClick={() => removePref(i)} className="text-red-600 text-sm">Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPref} className="text-er-primary text-sm hover:underline">Add another</button>
            </div>

            <Button type="submit" disabled={loading} className="w-40">{loading ? "Saving..." : "Finish"}</Button>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  );
}
