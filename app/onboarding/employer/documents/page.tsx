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

type DocType = "registration_cert" | "mra_tpin" | "business_license";
interface DocItem { document_type: DocType; document_url: string }

export default function EmployerDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([
    { document_type: "registration_cert", document_url: "" },
  ]);

  const setItem = (i: number, key: keyof DocItem, value: any) => {
    setDocuments((prev) => prev.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)));
  };
  const addItem = () => setDocuments((p) => [...p, { document_type: "registration_cert", document_url: "" }]);
  const removeItem = (i: number) => setDocuments((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.some((d) => !d.document_url)) {
      toast({ variant: "destructive", title: "Please provide URLs for all documents" });
      return;
    }
    setLoading(true);
    try {
      await initCsrf();
      await axiosClient.post("/onboarding/employer/upload-documents", { documents }, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""}`,
        },
      });
      router.push("/onboarding/employer/hr-contact");
    } catch (err: any) {
      toast({ variant: "destructive", title: err?.response?.data?.message || "Failed to upload documents" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="h-fit flex flex-col items-center justify-center p-6 my-auto">
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl h-fit space-y-6 my-auto">
            <ProgressIndicator steps={steps} current={2} />
            <div>
              <h1 className="text-3xl font-bold">Verification documents</h1>
              <p className="text-muted-foreground">Provide links to your official documents.</p>
            </div>

            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-md p-4">
                  <div className="flex flex-col">
                    <Label>Document Type</Label>
                    <select
                      className="w-full py-3 rounded-md border border-input bg-background px-3 text-sm"
                      value={doc.document_type}
                      onChange={(e) => setItem(i, "document_type", e.target.value as DocType)}
                    >
                      <option value="registration_cert">Company Registration Certificate</option>
                      <option value="mra_tpin">MRA TPIN</option>
                      <option value="business_license">Business License</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <Label>Document URL</Label>
                    <Input value={doc.document_url} onChange={(e) => setItem(i, "document_url", e.target.value)} placeholder="https://..." />
                  </div>
                  {documents.length > 1 && (
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
