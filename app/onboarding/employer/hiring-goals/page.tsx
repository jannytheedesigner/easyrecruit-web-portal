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

export default function EmployerHiringGoalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<string[]>([""]);

  const setGoal = (i: number, v: string) => setGoals((prev) => prev.map((g, idx) => (idx === i ? v : g)));
  const addGoal = () => setGoals((p) => [...p, ""]);
  const removeGoal = (i: number) => setGoals((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = goals.map((g) => g.trim()).filter((g) => g.length > 0);
    if (trimmed.length === 0) {
      toast({ variant: "destructive", title: "Add at least one hiring goal" });
      return;
    }
    setLoading(true);
    try {
      await initCsrf();
      await axiosClient.post("/onboarding/employer/hiring-goals", { hiring_goals: trimmed }, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""}`,
        },
      });
      router.push("/onboarding/employer/hiring-preferences");
    } catch (err: any) {
      toast({ variant: "destructive", title: err?.response?.data?.message || "Failed to save goals" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center my-auto p-6">
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6">
            <ProgressIndicator steps={steps} current={4} />
            <div>
              <h1 className="text-3xl font-bold">Hiring goals</h1>
              <p className="text-muted-foreground">List your top hiring priorities for the next 6–12 months.</p>
            </div>

            <div className="space-y-3">
              {goals.map((goal, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <Label className="sr-only">Goal</Label>
                    <Input
                      placeholder="e.g., Hire 2 senior accountants"
                      value={goal}
                      onChange={(e) => setGoal(i, e.target.value)}
                    />
                  </div>
                  {goals.length > 1 && (
                    <button type="button" onClick={() => removeGoal(i)} className="text-red-600 text-sm">Remove</button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={addGoal} className="text-er-primary text-sm hover:underline">Add another</button>
              <Button type="submit" disabled={loading} className="w-40">{loading ? "Saving..." : "Continue"}</Button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  );
}
