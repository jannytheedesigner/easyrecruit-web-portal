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
  logo?: string | null
  logo_url: string | null
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

export interface Application {
  id: number
  job_id: number
  job_seeker_id: number
  cover_letter: string
  bid_amount: string | null
  estimated_timeline: string | null
  status: string
  match_score: string
  submitted_at: string
  created_at: string
  updated_at: string
  resume_id: number | null
  cover_letter_id: number | null
}

export interface Proposal {
  id: number
  job_id: number
  user_id: number
  cover_letter: string
  bid_amount: string
  estimated_days: number
  status: "pending" | "screening" | "shortlisted" | "technical_interview" | "final_interview" | "hired" | "rejected"
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    profile?: {
      avatar?: string
      title?: string
      location?: string
      skills?: string[]
    }
  }
}

export interface Job {
  id: number
  employer_id: number
  title: string
  description: string
  job_type: string // "full-time"
  experience_level: string // "expert"
  job_category_id: number
  budget_type: string // "fixed"
  budget_min: string // "1500.00"
  budget_max: string // "2500.00"
  duration?: string
  status: "draft" | "published" | "paused" | "archived" | "closed" | "active"
  payment_status: string
  payment_amount: string
  published_at: string
  closed_at: string | null
  views_count: number
  created_at: string
  updated_at: string
  employer: Employer
  job_category: JobCategory
  skills: Skill[]
  proposals: Proposal[]
  applications: Application[]
  
  // New Audit fields
  source: "internal" | "external"
  external_link?: string
  match_score?: number

  // Legacy/Optional fields for backward compatibility
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

