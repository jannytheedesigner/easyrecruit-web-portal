export interface Skill {
  id: number
  name: string
  job_subcategory_id: number
  created_at: string
  updated_at: string
  pivot?: {
    job_id: number
    skill_id: number
    created_at: string
    updated_at: string
  }
}

export interface JobCategory {
  id: number
  name: string
  slug: string
  code: string
  description: string
  created_at: string
  updated_at: string
}

export interface Employer {
  id: number
  user_id: number
  company_name: string
  company_type: string
  industry: string
  logo: string | null // Mapped from logo_url if needed or kept as is. JSON says logo_url
  logo_url?: string
  about: string
  district: string
  address: string
  phone: string
  email: string
  website: string
  facebook_page?: string
  linkedin_page?: string
  verified: boolean
  verification_status: string
  open_to_remote: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: number
  employer_id: number
  title: string
  description: string
  job_type: string // "full_time"
  experience_level: string // "intermediate"
  job_category_id: number
  budget_type: number // "fixed"
  budget_min: number // "200000.00"
  budget_max: number // "2000000.00"
  duration: string // "12"
  status: "draft" | "active" | "paused" | "archived" | "closed"
  payment_status: string // "pending"
  payment_amount: string // "0.00"
  published_at: string
  closed_at: string | null
  views_count: number
  created_at: string
  updated_at: string
  employer: Employer
  job_category: JobCategory
  skills: Skill[]
  proposals: any[] // Define Proposal type if available, using any[] for now based on empty array in JSON

  // Legacy/Optional fields for backward compatibility or computed fields
  location?: string
  applications_count?: number
}

export const JOB_STATUSES = [
  "draft",
  "active",
  "paused",
  "closed",
  "archived",
] as const;
