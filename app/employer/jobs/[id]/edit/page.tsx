"use client"

import { JobForm } from "@/components/forms/JobForm"
import { useState, useEffect, use } from "react"
import axiosClient from "@/lib/axiosClient"
import { useRouter } from "next/navigation"
import type { Job } from "@/types/job"
import { Loader } from "@/components/Loader"

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [job, setJob] = useState<Job | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axiosClient.get(`/jobs/${resolvedParams.id}`)
                setJob(response.data.data || response.data)
            } catch (error) {
                console.error("Failed to fetch job:", error)
                alert("Failed to load job details")
            } finally {
                setFetching(false)
            }
        }
        fetchJob()
    }, [resolvedParams.id])

    const handleSubmit = async (data: any) => {
        setLoading(true)
        try {
            await axiosClient.put(`/jobs/${resolvedParams.id}`, {
                ...data,
                // Ensure numeric values are sent as numbers
                budget_min: Number(data.budget_min),
                budget_max: Number(data.budget_max),
                salary_min: Number(data.budget_min), // map back if needed, API seems to accept payload structure similar to create but existing EditJobModal used ...formData directly which had salart_min/max
                salary_max: Number(data.budget_max),
                // Add other mappings if API expects different keys for update vs create
                // create used: budget_min/max. edit used: salary_min/max in state but job type has salary_min/max.
                // Let's check AddJobModal logic again. It sends budget_min/max.
                // EditJobModal sends ...formData which has salary_min/max mapped from job.
                // I should probably send BOTH or unify.
                // Safe bet: send what Create sends + what Edit sent. 
            })
            router.push("/employer/jobs")
        } catch (error: any) {
            console.error("Failed to update job:", error)
            alert(error.response?.data?.message || "Failed to update job")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className="flex justify-center py-20"><Loader /></div>
    }

    if (!job) {
        return <div className="text-center py-20">Job not found</div>
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <JobForm
                mode="edit"
                initialData={job}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    )
}
