"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Job } from "@/types/job"
import {
  ArrowLeft, MapPin, DollarSign, Briefcase, Calendar,
  Edit, Trash2, Clock, Globe, Facebook, Linkedin,
  Building2, Users, Eye, FileText, CheckCircle2,
  ExternalLink, Share2
} from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EmployerLogo } from "@/components/employer-logo"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const fetchJob = async () => {
    try {
      const response = await axiosClient.get(`/jobs/${params.id}`)
      setJob(response.data)
    } catch (error) {
      console.error("Failed to fetch job:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await axiosClient.delete(`/jobs/${params.id}`)
      router.push("/employer/jobs")
    } catch (error) {
      console.error("Failed to delete job", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 bg-er-primary/5 p-2 rounded-full pr-5 hover:text-gray-900 transition-colors group"
        >
          <div className="p-2 bg-white rounded-full border border-gray-200 group-hover:border-gray-300 transition-colors">
            <ArrowLeft className="w-3 h-3" />
          </div>
          <span className="text-sm font-medium">Back to Jobs</span>
        </button>

        <div className="flex items-center gap-3">
          <Link href={`/employer/jobs/${job.id}/edit`}>
            <Button variant="outline" className="gap-2 bg-white">
              <Edit className="w-4 h-4" />
              Edit Job
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="gap-2 bg-red-500/5 border border-red-500/30 text-red-600 hover:bg-red-500 hover:border-red-500 hover:text-white"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex flex-row items-end gap-2">
              <span className="text-xs my-auto text-gray-400 font-medium">
                ID: ERJ{job.id}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase
                ${job.status === 'active' ? 'bg-green-100 text-green-700' :
                  job.status === 'closed' ? 'bg-red-100 text-red-700' :
                    job.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      job.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'}`}>

                {job.status}
              </span>

            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-medium text-gray-900 mb-4 pr-24">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-lg bg-er-primary/5 text-blue-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Job Type</span>
                      <span className="font-medium capitalize">{job.job_type?.replace('_', ' ') || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="w-px h-8 bg-gray-100 hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-lg bg-er-primary/5 text-er-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Location</span>
                      <span className="font-medium">{job.employer?.district || job.location || 'Remote'}</span>
                    </div>
                  </div>

                  <div className="w-px h-8 bg-gray-100 hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-lg bg-er-primary/5 text-er-primary">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Budget ({job.budget_type})</span>
                      <span className="font-medium">
                        {job.budget_min && job.budget_max
                          ? `${formatCurrency(Number(job.budget_min))} - ${formatCurrency(Number(job.budget_max))}`
                          : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Experience Level</p>
                  <p className="font-semibold text-gray-900 capitalize">{job.experience_level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900 capitalize">{job.duration || "Indefinite"} Months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900 line-clamp-1" title={job.job_category?.name}>{job.job_category?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Posted Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(job.published_at || job.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-none">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Job Description
            </h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-none">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-none">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-3 bg-er-primary/5 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-none text-er-complimentary">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Total Views</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{job.views_count || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-er-primary/5 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-none text-er-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Proposals</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{job.proposals?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Employer Information */}
          {job.employer && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-none">
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase mb-4">About the Employer</h3>

              <div className="flex gap-2 mb-6">
                <div className="my-auto flex w-14 h-14 rounded-full bg-er-complimentary overflow-hidden border-2 border-white shadow-none items-center justify-center">
                  <EmployerLogo
                    src={job.employer.logo_url}
                    alt={job.employer.company_name}
                    width={80}
                    height={80}
                    imageClassName="w-full h-full object-cover"
                    logoClassName="flex w-[2em]"
                  />
                </div>
                <div className="my-auto flex flex-col">
                  <h4 className="font-bold text-gray-900 text-lg">{job.employer.company_name}</h4>
                  <p className="text-sm text-gray-500">Industry: {job.employer.industry}</p>
                </div>
                {job.employer.verified && (
                  <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={job.employer.website} target="_blank" rel="noreferrer" className="hover:text-er-primary truncate hover:underline">
                    {job.employer.website || 'No website'}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{job.employer.address}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {job.employer.facebook_page && (
                    <a href={job.employer.facebook_page} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {job.employer.linkedin_page && (
                    <a href={job.employer.linkedin_page} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Share Card */}
          <div className="bg-gradient-to-br from-er-primary to-er-primary-dark rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Share this Job</h3>
            <p className="text-white/80 text-sm mb-4">Help more people verify this opportunity.</p>
            <Button
              variant="secondary"
              className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white border-0"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
              }}
            >
              <Share2 className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
