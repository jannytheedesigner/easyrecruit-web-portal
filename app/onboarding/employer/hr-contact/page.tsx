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

const steps = ["Company Info", "Company Profile", "Documents", "HR Contact", "Goals", "Preferences", "Confirm"];

interface ContactItem { name: string; position: string; email: string; phone: string }

export default function EmployerHrContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<ContactItem[]>([
    { name: "", position: "", email: "", phone: "" },
  ]);

  const setItem = (i: number, key: keyof ContactItem, value: string) => setContacts((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)));
  const addItem = () => setContacts((p) => [...p, { name: "", position: "", email: "", phone: "" }]);
  const removeItem = (i: number) => setContacts((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.some((c) => !c.name)) {
      toast({ variant: "destructive", title: "Each contact must have a name" });
      return;
    }
    setLoading(true);
    try {
      await initCsrf();
      await axiosClient.post("/onboarding/employer/hr-contact", { contacts }, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""}`,
        },
      });
      router.push("/onboarding/employer/hiring-goals");
    } catch (err: any) {
      toast({ variant: "destructive", title: err?.response?.data?.message || "Failed to save contacts" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center p-6 my-auto">
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6">
            <ProgressIndicator steps={steps} current={3} />
            <div>
              <h1 className="text-3xl font-bold">HR contact setup</h1>
              <p className="text-muted-foreground">Add at least one contact person for hiring.</p>
            </div>

            <div className="space-y-4">
              {contacts.map((c, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-md p-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={c.name} onChange={(e) => setItem(i, "name", e.target.value)} required />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={c.position} onChange={(e) => setItem(i, "position", e.target.value)} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={c.email} onChange={(e) => setItem(i, "email", e.target.value)} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={c.phone} onChange={(e) => setItem(i, "phone", e.target.value)} />
                  </div>
                  {contacts.length > 1 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeItem(i)} className="text-red-600 text-sm">Remove</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={addItem} className="text-er-primary text-sm hover:underline">Add another</button>
              <Button type="submit" disabled={loading} className="w-40">{loading ? "Saving..." : "Continue"}</Button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  );
}
