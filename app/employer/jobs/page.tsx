"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import type { Job } from "@/types/job"
import { Plus, Tag, Album, Search, Filter, MapPin, MapPinned, DollarSign, Briefcase, Clock, Users, TrendingUp, Calendar, Building, ExternalLink, MoreVertical, Eye, Edit, Trash2, PlusCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/easycomponents/button"
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers"
import { useAuth } from "@/hooks/useAuth"
import { getRoleBasePath } from "@/lib/roleRoutes"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EmployerLogo } from "@/components/employer-logo"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [statusUpdateState, setStatusUpdateState] = useState<{ job: Job, newStatus: string } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
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

  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteJob = async () => {
    if (!selectedJob) return

    try {
      await axiosClient.delete(`/jobs/${selectedJob.id}`)
      fetchJobs()
      setShowDeleteConfirm(false)
      setSelectedJob(null)
    } catch (error) {
      console.error("Failed to delete job:", error)
    }
  }

  const handleStatusChange = (job: Job, newStatus: string) => {
    setStatusUpdateState({ job, newStatus })
  }

  const confirmStatusChange = async () => {
    if (!statusUpdateState) return

    setIsUpdating(true)
    try {
      await axiosClient.patch(
        `/employer/jobs/${statusUpdateState.job.id}/status`,
        {
          status: statusUpdateState.newStatus,
        }
      )

      fetchJobs()
      setStatusUpdateState(null)
    } catch (error) {
      console.error("Failed to update job status:", error)
    } finally {
      setIsUpdating(false)
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
      case "active":
        return "bg-er-complimentary/30 border border-er-complimentary text-er-dark"
      case "closed":
        return "bg-red-500 text-white"
      case "draft":
        return "bg-er-secondary/30 border border-er-secondary text-er-secondary-dark"
      case "paused":
        return "bg-yellow-500/30 border border-yellow-500 text-yellow-700"
      case "archived":
        return "bg-gray-500/30 border border-gray-500 text-gray-700"
      default:
        return "bg-er-primary/30 border border-er-primary text-er-white"
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
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    drafts: jobs.filter(j => j.status === 'draft').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-fit bg-none py-20">
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
          <Link href="/employer/jobs/create">
            <Button
              variant={"primaryRoundedCorner"}
              className="flex flex-row gap-2 bg-er-secondary rounded-full text-base py-3 px-4 text-er-dark"
            >
              <PlusCircle />
              New Job
            </Button>
          </Link>
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
                <div className="text-sm text-gray-700 font-medium">Active Positions</div>
                <div className="text-5xl font-bold text-er-dark mt-1">{stats.active}</div>
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
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, description, or location..."
              className="texts-sm tracking-tight w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-er-primary focus:border-transparent bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-3">


              <Select value={filterStatus} onValueChange={setFilterStatus}>

                <SelectTrigger className="min-w-48 px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-er-primary focus:border-er-primary bg-gray-50 data-[state=open]:ring-2 data-[state=open]:ring-primary">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>

                <SelectContent className="absolute w-[14em] mt-12 left-0">
                  <SelectGroup>
                    <SelectItem value="all">
                      <span className="font-medium">All Status</span>
                    </SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-sm ${viewMode === "grid" ? "bg-white" : "hover:bg-gray-200"} transition-colors`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-1">
                  <div className="bg-er-primary rounded"></div>
                  <div className="bg-er-primary rounded"></div>
                  <div className="bg-er-primary rounded"></div>
                  <div className="bg-er-primary rounded"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-sm ${viewMode === "list" ? "bg-white" : "hover:bg-gray-200"} transition-colors`}
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === "all" ? "bg-er-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === "active" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Active Positions
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === "draft" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilterStatus("paused")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === "paused" ? "bg-er-primary-light text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Paused
          </button>
          <button
            onClick={() => setFilterStatus("closed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === "closed" ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Closed
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100 transition-colors">
            High Priority
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-er-primary/20 transition-all duration-300 p-5 flex flex-col gap-4"
            >
              {/* Top Row - Logo & Status */}
              <div className="flex items-center">
                <div className="flex flex-row gap-3">
                  <div className="w-12 h-12 rounded-full bg-er-complimentary flex items-center justify-center overflow-hidden">
                    <EmployerLogo
                      src={job.employer?.logo_url}
                      alt="Company Logo"
                      width={48}
                      height={48}
                      imageClassName="w-full h-full object-cover"
                      logoClassName="flex w-[2em]"
                    />
                  </div>
                  <div className="my-auto flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPinned className="w-4 h-4 my-auto" />
                        <span className="my-auto">{job.employer?.district || job.location || 'Remote'}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="capitalize">{job.job_type?.replace('_', ' ') || 'Full Time'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-auto">
                  <Select
                    value={job.status}
                    onValueChange={(value) => handleStatusChange(job, value)}
                  >
                    <SelectTrigger
                      className={`h-8 px-3 rounded-full text-xs font-semibold border-0 gap-1 ${getStatusColor(
                        job.status
                      )}`}
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="text-xs tracking-wider">ACTIVE</SelectItem>
                      <SelectItem value="closed" className="text-xs tracking-wider">CLOSED</SelectItem>
                      <SelectItem value="draft" className="text-xs tracking-wider">DRAFT</SelectItem>
                      <SelectItem value="paused" className="text-xs tracking-wider">PAUSED</SelectItem>
                      <SelectItem value="archived" className="text-xs tracking-wider">ARCHIVED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm">
                {job.description}
              </div>


              {/* Footer Bar */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{job.proposals?.length || 0} Applicants</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`${basePath}/jobs/${job.id}`}
                    className="px-4 py-2 bg-er-primary text-white text-xs font-medium rounded-full hover:bg-er-primary-dark transition-colors flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDeleteJob(job)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <Trash2 className="w-4 h-4" />
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
            <table className="w-full min-w-[900px]">
              <thead className="bg-er-dark m-4 border-b border-gray-200">
                <tr className="">
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Job Title</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Location</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Budget</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Proposals</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Status</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Posted</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex flex-row gap-2">
                        <div className="w-8 h-8 rounded-full bg-er-complimentary flex items-center justify-center overflow-hidden">
                          <EmployerLogo
                            src={job.employer?.logo_url}
                            alt="Company Logo"
                            width={32}
                            height={32}
                            imageClassName="w-full h-full object-cover"
                            logoClassName="flex w-[1.25em]"
                          />
                        </div>
                        <div className="font-semibold my-auto flex text-gray-900">
                          <span>{job.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4" />
                        {job.employer?.district || job.location || 'Remote'}
                      </div>
                    </td>
                    <td className="py-5 px-6 font-medium text-gray-900">
                      <span className="text-xs bg-er-primary/5 border border-er-primary/30 rounded-full py-1.5 px-3">{job.budget_min && job.budget_max
                        ? `${formatCurrency(Number(job.budget_min))} – ${formatCurrency(Number(job.budget_max))}`
                        : '-'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{job.proposals?.length || 0}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <Select
                        value={job.status}
                        onValueChange={(value) => handleStatusChange(job, value)}
                      >
                        <SelectTrigger
                          className={`w-fit h-7 px-3 rounded-full text-xs font-bold border-0 gap-1 ${getStatusColor(
                            job.status
                          )}`}
                        >
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">ACTIVE</SelectItem>
                          <SelectItem value="closed">CLOSED</SelectItem>
                          <SelectItem value="draft">DRAFT</SelectItem>
                          <SelectItem value="paused">PAUSED</SelectItem>
                          <SelectItem value="archived">ARCHIVED</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-5 px-6 text-sm text-gray-600">
                      {formatDate(job.published_at || job.created_at)}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`${basePath}/jobs/${job.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/employer/jobs/${job.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Listings yet </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setSearchTerm(""); setFilterStatus("all") }}
              className="px-6 py-3 bg-er-primary text-white rounded-full font-medium text-sm hover:bg-er-primary-dark transition-colors"
            >
              Clear Filters
            </button>
            <Link
              href="/employer/jobs/create"
              className="px-6 py-3 border border-er-primary text-primary rounded-full text-sm font-medium hover:bg-er-primary/5 transition-colors"
            >
              Create First Job
            </Link>
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
            <Button className="bg-er-primary/5 text-er-primary-dark hover:text-white border border-er-primary/50 disabled:opacity-50">
              ← Previous
            </Button>
            <button className="px-4 py-2 bg-er-primary text-white rounded-full hover:bg-blue-700">
              1
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full">
              2
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full">
              3
            </button>
            <Button className="bg-er-primary/5 text-er-primary-dark hover:text-white border border-er-primary/50 disabled:opacity-50">
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Job</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedJob.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant={"outline"}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteJob}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Dialog */}
      {
        statusUpdateState && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Job Status</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to change the status of "{statusUpdateState.job.title}" to{" "}
                  <span className="font-bold text-gray-900">{statusUpdateState.newStatus.toUpperCase()}</span>?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant={"outline"}
                    onClick={() => setStatusUpdateState(null)}
                    disabled={isUpdating}
                    className="flex-1 py-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmStatusChange}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
