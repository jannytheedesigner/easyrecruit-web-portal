"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Job } from "@/types/job"
import { ArrowLeft, MapPin, DollarSign, Briefcase, Calendar, Edit, Trash2 } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/helpers"

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.job_type}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {formatDate(job.created_at)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        {/* budget */}
        {job.budget_min && job.budget_max && (
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
            <DollarSign className="w-5 h-5" />
            {formatCurrency(job.budget_min)} - {formatCurrency(job.budget_max)}
          </div>
        )}

        {/* Description */}
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications ({job.applications_count || 0})</h3>
        <div className="text-gray-600">No applications yet</div>
      </div>
    </div>
  )
}
