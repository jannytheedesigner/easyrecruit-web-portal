export interface OnboardingStatus {
  completed: boolean
  current_step: string
  role: "employer" | "jobseeker"
}

export interface OnboardingProgress {
  step: number;
  total: number;
  completed: boolean;
}

export interface EmployerOnboardingData {
  company_name?: string
  business_email?: string
  company_establishment_date?: string
  company_website?: string
  company_size?: string
  international_talent?: boolean
  roles_skills?: string[]
  hiring_preferences?: string[]
  hiring_goals?: string
}

export interface JobseekerOnboardingData {
  full_name?: string
  phone?: string
  location?: string
  skills?: string[]
  job_categories?: string[]
  job_preferences?: string[]
  portfolio_url?: string
  cv_file?: File
}
