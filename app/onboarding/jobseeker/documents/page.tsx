"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosClient, { initCsrf } from "@/lib/axiosClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import OnboardingLayout from "@/components/layout/OnboardingLayout"
import ProgressIndicator from "@/components/onboarding/ProgressIndicator"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "@/components/Loader"
import { FileText, Trash2, CheckCircle, Loader2 } from "lucide-react"

interface ExistingDocument {
  id: number
  document_type: string
  title: string
  description?: string
  file_path: string
  format_type: string
  file_size: number
  verification_status: string
}

interface NewDocument {
  file: File
  document_type: string
  description?: string
}

export default function JobseekerDocumentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [existingDocs, setExistingDocs] = useState<ExistingDocument[]>([])
  const [newDocs, setNewDocs] = useState<NewDocument[]>([])

  const steps = [
    "Personal Info",
    "Education Background",
    "Work Experience",
    "Skills & Interests",
    "Documents",
    "Referees",
  ]

  // ✅ Fetch user's existing documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        await initCsrf()
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
        const res = await axiosClient.get("/onboarding/jobseeker/documents", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setExistingDocs(res.data?.documents || [])
      } catch (err) {
        console.warn("No saved documents found — starting new upload.")
      } finally {
        setInitialLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  // ✅ Handle file selection
  const handleFileChange = (type: string, files: FileList | null) => {
    if (!files) return
    const uploaded = Array.from(files).map((file) => ({
      file,
      document_type: type,
      description: "",
    }))
    setNewDocs((prev) => [...prev, ...uploaded])
  }

  // ✅ Handle description change
  const handleDescriptionChange = (index: number, value: string) => {
    setNewDocs((prev) => prev.map((doc, i) => (i === index ? { ...doc, description: value } : doc)))
  }

  // ✅ Remove file from new uploads
  const removeFile = (index: number) => setNewDocs((prev) => prev.filter((_, i) => i !== index))

  // ✅ Upload new documents
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newDocs.length === 0) {
      toast({ title: "No files selected", description: "Please select at least one document." })
      return
    }

    setError("")
    setLoading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      newDocs.forEach((doc, i) => {
        formData.append(`documents[${i}][document_type]`, doc.document_type)
        formData.append(`documents[${i}][file]`, doc.file)
        if (doc.description) formData.append(`documents[${i}][description]`, doc.description)
      })

      await initCsrf()
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""

      const res = await axiosClient.post("/onboarding/jobseeker/upload-documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        },
      })

      toast({
        title: "Success!",
        description: "Documents uploaded successfully.",
      })

      setNewDocs([])
      setExistingDocs(res.data?.jobseeker?.documents || [])

      router.replace("/onboarding/jobseeker/referees")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Failed to upload documents",
        description:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "An unexpected error occurred.",
        variant: "destructive",
      })
      setError("Upload failed. Please try again.")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (initialLoading) {
    return (
      <OnboardingLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500 text-sm">
          <Loader size="md" />
          <p className="mt-2">Loading your saved documents...</p>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <ProtectedRoute>
      <OnboardingLayout>
        <div className="flex-1 flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl">
            <ProgressIndicator steps={steps} current={4} />

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                Upload Your Documents
              </h1>
              <p className="text-slate-500 text-sm">
                Upload important files to complete your profile.
              </p>
              <div className="h-px bg-slate-100 mt-5" />
            </div>

            {/* ⚙️ Existing Documents */}
            {existingDocs.length > 0 && (
              <div className="mb-8 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h2 className="text-base font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Uploaded Documents
                </h2>
                <ul className="divide-y divide-slate-200">
                  {existingDocs.map((doc) => (
                    <li key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-er-primary" />
                        <div>
                          <p className="font-medium text-slate-800">{doc.title}</p>
                          <p className="text-xs text-slate-500">
                            {doc.document_type} • {Math.round(doc.file_size / 1024)} KB • {doc.format_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs mt-2 sm:mt-0 font-medium ${doc.verification_status === "pending"
                          ? "text-amber-500"
                          : doc.verification_status === "approved"
                            ? "text-green-600"
                            : "text-red-500"
                          }`}
                      >
                        {doc.verification_status === "pending"
                          ? "Pending Verification"
                          : doc.verification_status === "approved"
                            ? "Verified"
                            : "Rejected"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🆕 Upload New Documents */}
            <div className="space-y-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CV */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Curriculum Vitae</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="cv_upload"
                    onChange={(e) => handleFileChange("CV", e.target.files)}
                  />
                  <label
                    htmlFor="cv_upload"
                    className="cursor-pointer text-er-primary font-medium hover:underline"
                  >
                    Click to upload CV
                  </label>
                  <p className="text-xs text-slate-400 mt-1">Supported: PDF, DOC, DOCX</p>
                </div>
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Certificates</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="cert_upload"
                    onChange={(e) => handleFileChange("Certificate", e.target.files)}
                  />
                  <label
                    htmlFor="cert_upload"
                    className="cursor-pointer text-er-primary font-medium hover:underline"
                  >
                    Click or drag to upload
                  </label>
                  <p className="text-xs text-slate-400 mt-1">Supported: PDF, JPG, PNG, DOC</p>
                </div>
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">National ID</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="nid_upload"
                    onChange={(e) => handleFileChange("National ID", e.target.files)}
                  />
                  <label
                    htmlFor="nid_upload"
                    className="cursor-pointer text-er-primary font-medium hover:underline"
                  >
                    Click to upload National ID
                  </label>
                  <p className="text-xs text-slate-400 mt-1">Supported: PDF, JPG, PNG</p>
                </div>
              </div>
            </div>

            {/* New Documents Preview */}
            {newDocs.length > 0 && (
              <div className="mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h2 className="text-sm font-medium text-slate-700 mb-3">Files ready for upload</h2>
                <ul className="divide-y divide-slate-200">
                  {newDocs.map((doc, i) => (
                    <li key={i} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{doc.file.name}</p>
                        <p className="text-xs text-slate-400">
                          {doc.document_type} • {Math.round(doc.file.size / 1024)} KB
                        </p>
                        <input
                          type="text"
                          placeholder="Add description (optional)"
                          className="mt-2 w-full sm:w-72 border border-slate-200 rounded-lg text-sm px-2 py-1 focus:ring-er-primary/30 focus:outline-none"
                          value={doc.description || ""}
                          onChange={(e) => handleDescriptionChange(i, e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-500 text-sm mt-2 sm:mt-0 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upload Progress */}
            {loading && (
              <div className="mt-4">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-er-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">{uploadProgress}% uploaded</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={() => router.replace("/onboarding/jobseeker/skills-experience")}
                className="rounded-full border border-slate-200 px-8 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || newDocs.length === 0}
                className="rounded-full bg-er-primary px-10 py-2.5 text-sm text-white font-medium hover:bg-er-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </OnboardingLayout>
    </ProtectedRoute>
  )
}
