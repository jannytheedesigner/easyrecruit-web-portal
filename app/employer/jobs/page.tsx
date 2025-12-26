"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Job } from "@/types/job"
import { Plus, Album, Search, Filter, MapPin, DollarSign, Briefcase, Clock, Users, TrendingUp, Calendar, Building, ExternalLink, MoreVertical, Eye, Edit, Trash2, PlusCircle } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/helpers"
import { useAuth } from "@/hooks/useAuth"
import { getRoleBasePath } from "@/lib/roleRoutes"
import { Button } from "@/components/easycomponents/button"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { user } = useAuth()
  const basePath = getRoleBasePath(user?.role)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axiosClient.get("/jobs")
      setJobs(response.data.data || [])
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || job.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-gradient-to-r from-green-500 to-emerald-600"
      case "closed":
        return "bg-gradient-to-r from-gray-500 to-gray-600"
      case "draft":
        return "bg-gradient-to-r from-yellow-500 to-amber-600"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return "🔵"
      case "closed":
        return "⚫"
      case "draft":
        return "🟡"
      default:
        return "⚪"
    }
  }

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    drafts: jobs.filter(j => j.status === 'draft').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-er-primary p-10 rounded-3xl flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h1 className="text-3xl font-semibold text-white">Recruitment Overview</h1>
                <p className="text-gray-100 mt-1">Track, manage and optimize your job postings</p>
              </div>
            </div>
          </div>
          <Button variant={"primaryRoundedCorner"} className="flex flex-row gap-2 bg-er-secondary rounded-full text-base py-3 px-4 text-er-dark">
            <PlusCircle />
            New Job
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-er-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 font-medium">Total Jobs</div>
                <div className="text-5xl font-bold text-er-dark mt-1">{stats.total}</div>
              </div>
              <div className="my-auto flex p-4 bg-er-primary rounded-md">
                <Album className="w-10 h-10 stroke-[1px] text-er-white" />
              </div>

            </div>
          </div>
          <div className="bg-er-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 font-medium">Open Positions</div>
                <div className="text-5xl font-bold text-er-dark mt-1">{stats.open}</div>
              </div>
              <div className="my-auto flex p-4 bg-er-complimentary rounded-md">
                <TrendingUp className="w-10 h-10 stroke-[1px] text-er-white" />
              </div>
            </div>
          </div>
          <div className="bg-er-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 font-medium">In Drafts</div>
                <div className="text-5xl font-bold text-er-dark mt-1">{stats.drafts}</div>
              </div>
              <div className="my-auto flex p-4 bg-er-secondary rounded-md">
                <Clock className="w-10 h-10 stroke-[1px] text-er-white" />
              </div>
            </div>
          </div>
          <div className="bg-er-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 font-medium">Closed Jobs</div>
                <div className="text-5xl font-bold text-er-dark mt-1">{stats.closed}</div>
              </div>
              <div className="my-auto flex p-4 bg-er-dark rounded-md">
                <Users className="w-10 h-10 stroke-[1px] text-er-white" />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, description, or location..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 min-w-40"
              >
                <option value="all">All Status</option>
                <option value="open">Open Positions</option>
                <option value="closed">Closed</option>
                <option value="draft">Drafts</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow" : "hover:bg-gray-200"} transition-colors`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-1">
                  <div className="bg-gray-400 rounded"></div>
                  <div className="bg-gray-400 rounded"></div>
                  <div className="bg-gray-400 rounded"></div>
                  <div className="bg-gray-400 rounded"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow" : "hover:bg-gray-200"} transition-colors`}
              >
                <div className="w-5 h-5 flex flex-col gap-1">
                  <div className="bg-gray-400 h-1 rounded-full"></div>
                  <div className="bg-gray-400 h-1 rounded-full"></div>
                  <div className="bg-gray-400 h-1 rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilterStatus("open")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "open" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Open Positions
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "draft" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilterStatus("closed")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "closed" ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Closed
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100 transition-colors">
            High Priority
          </button>
        </div>
      </div>

      {/* Jobs Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300"
            >
              {/* Job Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{getStatusIcon(job.status)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Job Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{job.department || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {job.salary_min && job.salary_max
                        ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                        : "Salary not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{job.applications_count || 0}</span>
                      <span className="text-gray-600">applicants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatTimeAgo(job.created_at)}</span>
                    </div>
                  </div>
                  <Link
                    href={`${basePath}/jobs/${job.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Action Bar (on hover) */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Job Title</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Applicants</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Posted</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">{job.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{job.type}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{job.applications_count || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{formatDate(job.created_at)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`${basePath}/jobs/${job.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setSearchTerm(""); setFilterStatus("all") }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
            <button className="px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors">
              Create First Job
            </button>
          </div>
        </div>
      )}

      {/* Pagination (if needed) */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">1-{filteredJobs.length}</span> of{' '}
            <span className="font-semibold">{filteredJobs.length}</span> jobs
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              ← Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
              1
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              2
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              3
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}