"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Job } from "@/types/job"
import {
  ArrowLeft, MapPin, DollarSign, Briefcase, Calendar,
  Edit, Trash2, ExternalLink, ShieldCheck, TrendingUp,
  CheckCircle, AlertCircle, Info, Building, X, Clock, Tag, Users
} from "lucide-react"
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [proposal, setProposal] = useState({
    cover_letter: "",
    bid_amount: "",
    estimated_days: ""
  })

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const fetchJob = async () => {
    try {
      const response = await axiosClient.get(`/jobs/${params.id}`)
      setJob(response.data.data || response.data)
    } catch (error) {
      console.error("Failed to fetch job:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyInternal = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axiosClient.post("/proposals", {
        job_id: job?.id,
        cover_letter: proposal.cover_letter,
        bid_amount: proposal.bid_amount,
        estimated_days: proposal.estimated_days
      })
      toast({ title: "Application Sent!", description: "Your proposal has been submitted successfully." })
      setIsApplying(false)
      router.push("/jobseeker/applications")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: err.response?.data?.message || "Please check your proposal and try again."
      })
    } finally {
      setSubmitting(false)
    }
  }

  const trackExternalClick = async () => {
    if (!job) return
    try {
      await axiosClient.post(`/jobs/${job.id}/track-click`)
    } catch (err) {
      console.warn("Tracking failed")
    }
    window.open(job.external_link, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Job Not Found</h2>
        <p className="text-slate-500 mb-8">The opportunity you are looking for might have been closed or removed.</p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-full">
          Back to Listings
        </Button>
      </div>
    )
  }

  const isEmployer = user?.role === "employer"
  const isJobSeeker = user?.role === "jobseeker"
  const isExternal = job.source === "external"

  return (
    <div className="container mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-er-primary transition-colors font-medium group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Header Card */}
          <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden ring-1 ring-slate-100">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-er-primary/5 rounded-bl-[100%] transition-transform group-hover:scale-110" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                {isExternal ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <ExternalLink className="w-3.5 h-3.5" />
                    External Source
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-er-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Internal
                  </span>
                )}
                {isJobSeeker && job.match_score !== undefined && (
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${job.match_score > 80 ? "text-green-600 bg-green-50 border-green-100" : "text-yellow-600 bg-yellow-50 border-yellow-100"}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    {job.match_score}% Match
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display leading-tight">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-8">
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Briefcase className="w-4 h-4 text-er-primary" />
                  <span className="font-semibold capitalize text-slate-700">{job.job_type?.replace("_", " ")}</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-er-primary" />
                  <span className="text-slate-700">{job.location || job.employer?.district || "Remote"}</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-er-primary" />
                  <span className="text-slate-700 capitalize">{job.experience_level}</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Clock className="w-4 h-4 text-er-primary" />
                  <span className="text-slate-700">{job.duration || "N/A"} Months</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Tag className="w-4 h-4 text-er-primary" />
                  <span className="text-slate-700 line-clamp-1">{job.job_category?.name}</span>
                </span>
                <span className="flex items-center gap-2 bg-er-primary/5 px-4 py-2 rounded-xl border border-er-primary/20">
                  <Users className="w-4 h-4 text-er-primary" />
                  <span className="text-er-primary font-bold">{job.applications?.length || 0} Applicants</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-er-primary" />
                  <span className="text-slate-700">Posted {formatDate(job.created_at)}</span>
                </span>
              </div>

              {/* Salary Section */}
              <div className="flex items-center gap-4 p-6 bg-er-primary/5 rounded-2xl border border-er-primary/10 mb-10 w-fit">
                <div className="p-3 bg-er-primary text-white rounded-xl shadow-lg shadow-er-primary/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-er-primary-dark tracking-wider opacity-60">Estimated Budget (MWK)</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {job.budget_min && job.budget_max
                      ? `${formatCurrency(Number(job.budget_min))} - ${formatCurrency(Number(job.budget_max))}`
                      : "Negotiable"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  Job Description
                </h3>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {job.description}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <span key={s.id} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200 hover:border-er-primary hover:bg-white transition-all cursor-default">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Action Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-er-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 font-display">Take Action</h2>

              {isEmployer ? (
                <div className="space-y-3">
                  <Button className="w-full h-14 rounded-2xl bg-er-primary hover:bg-er-primary/90 text-lg font-bold shadow-lg shadow-er-primary/20">
                    <Edit className="w-5 h-5 mr-2" /> Edit Listing
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 hover:bg-white/10 text-white text-lg font-bold">
                    <Trash2 className="w-5 h-5 mr-2" /> Delete Job
                  </Button>
                </div>
              ) : isJobSeeker ? (
                <div className="space-y-4">
                  {isExternal ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        This opportunity is hosted on an external site. EasyRecruit helps you track your interest in such jobs.
                      </p>
                      <Button
                        onClick={trackExternalClick}
                        className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold shadow-xl shadow-orange-500/20 uppercase tracking-tight"
                      >
                        <ExternalLink className="w-6 h-6 mr-2" /> Apply External
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        Apply directly through EasyRecruit for a seamless tracking and communication experience.
                      </p>
                      <Button
                        disabled={isApplying}
                        onClick={() => setIsApplying(true)}
                        className="w-full h-16 rounded-2xl bg-er-primary hover:bg-er-primary/90 text-white text-lg font-bold shadow-xl shadow-er-primary/20 uppercase tracking-tight"
                      >
                        {isApplying ? "Preparing Form..." : "Apply Now"}
                      </Button>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      <span>Ad Visibility</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Verified Employer</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="block">
                  <Button className="w-full h-14 rounded-2xl bg-er-primary hover:bg-er-primary/90 text-lg font-bold">
                    Login to Apply
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Company Preview Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm ring-1 ring-slate-100 overflow-hidden group">
            <h3 className="text-sm uppercase font-bold tracking-[0.2em] text-slate-400 mb-8">About Employer</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                {job.employer?.logo_url ? (
                  <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-er-primary transition-colors">{job.employer?.company_name}</h4>
                <p className="text-sm text-slate-500">{job.employer?.industry || "Corporate Service"}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed mb-6 font-medium italic">
              "{job.employer?.about || "This employer has shared limited profile information."}"
            </p>

            <Link href={`/employer/profile/${job.employer?.id}`}>
              <Button variant="link" className="p-0 h-auto text-er-primary font-bold text-sm">View Full Profile →</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Internal Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-3xl overflow-hidden ring-1 ring-slate-200 animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 px-10 py-8 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Apply for Job</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Submitting application to: <span className="text-er-primary">{job.employer?.company_name}</span></p>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApplyInternal} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bid_amount" className="text-sm font-bold text-slate-700">Bid Amount (MWK)</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-er-primary transition-colors">K</div>
                    <Input
                      id="bid_amount"
                      type="number"
                      required
                      placeholder="e.g. 500,000"
                      className="pl-9 h-14 rounded-xl border-slate-200 focus:ring-er-primary shadow-inner"
                      value={proposal.bid_amount}
                      onChange={(e) => setProposal({ ...proposal, bid_amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_days" className="text-sm font-bold text-slate-700">Estimated Duration (Days)</Label>
                  <Input
                    id="estimated_days"
                    type="number"
                    required
                    placeholder="e.g. 30"
                    className="h-14 rounded-xl border-slate-200 shadow-inner"
                    value={proposal.estimated_days}
                    onChange={(e) => setProposal({ ...proposal, estimated_days: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_letter" className="text-sm font-bold text-slate-700">Proposal / Cover Letter</Label>
                <textarea
                  id="cover_letter"
                  required
                  rows={6}
                  placeholder="Tell the employer why you are the best fit for this role..."
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm focus:ring-2 focus:ring-er-primary focus:border-transparent transition-all outline-none shadow-inner"
                  value={proposal.cover_letter}
                  onChange={(e) => setProposal({ ...proposal, cover_letter: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 py-4 px-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <Info className="w-5 h-5 text-er-primary" />
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  Your profile information (Education, Skills, etc.) will be automatically shared with the employer along with this proposal.
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApplying(false)}
                  className="flex-1 h-14 rounded-2xl text-slate-700 font-bold border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] h-14 rounded-2xl bg-er-primary hover:bg-er-primary/90 text-white font-bold text-lg shadow-lg shadow-er-primary/20 transition-all uppercase tracking-tight"
                >
                  {submitting ? "Submitting Application..." : "Send Proposal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
