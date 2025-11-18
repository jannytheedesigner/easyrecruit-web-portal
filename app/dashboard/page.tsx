"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Loader } from "@/components/Loader"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const target = user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"
    router.replace(target)
  }, [user, router])

  return (
    <div className="flex items-center justify-center h-full py-20">
      <Loader size="lg" />
    </div>
  )
}
