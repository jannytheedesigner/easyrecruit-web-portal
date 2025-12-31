"use client"

import { JobForm } from "@/components/forms/JobForm"
import { useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { useRouter } from "next/navigation"

export default function CreateJobPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (data: any) => {
        setLoading(true)
        try {
            // Logic from AddJobModal
            const payload = {
                title: data.title,
                description: data.description,
                job_type: data.job_type,
                experience_level: data.experience_level,
                category_id: data.category_id,
                budget_type: data.budget_type,
                budget_min: Number(data.budget_min),
                budget_max: Number(data.budget_max),
                duration: data.duration || null,
                skills: data.skills, // Assuming JobForm gives array of IDs or handles it
                location: data.location,
                // department: data.department // Add if needed
            }

            await axiosClient.post("/jobs", payload) // or /employer/jobs if needed
            router.push("/employer/jobs")
        } catch (error: any) {
            console.error("Failed to create job:", error)
            alert(error.response?.data?.message || "Failed to create job")
        } finally {
            setLoading(false)
        }
    }

    return (
        <JobForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={loading}
        />
    )
}
