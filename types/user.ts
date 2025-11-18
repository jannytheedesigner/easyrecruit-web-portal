export interface User {
  id: number
  name: string
  email: string
  role: "employer" | "jobseeker" | "admin"
  onboarding_completed: boolean
  created_at: string
  updated_at: string
  profile?: UserProfile
}

export interface UserProfile {
  company_name?: string
  business_email?: string
  company_size?: string
  phone?: string
  location?: string
  bio?: string
  skills?: string[]
  avatar?: string
}
