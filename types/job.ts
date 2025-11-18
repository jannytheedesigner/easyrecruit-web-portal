export interface Job {
  id: number
  title: string
  description: string
  category: string
  type: "full-time" | "part-time" | "contract" | "freelance"
  location: string
  salary_min?: number
  salary_max?: number
  status: "open" | "closed" | "draft"
  created_at: string
  updated_at: string
  employer_id: number
  applications_count?: number
}

export interface JobApplication {
  id: number
  job_id: number
  jobseeker_id: number
  status: "pending" | "accepted" | "rejected"
  cover_letter?: string
  created_at: string
}
