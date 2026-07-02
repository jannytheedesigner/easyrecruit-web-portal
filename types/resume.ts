export interface Resume {
  id: number;
  user_id: number;
  title: string;
  summary?: string;
  template_name: string;
  is_default: boolean;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileDetails {
  full_name?: string;
  email?: string;
  phone?: string;
  current_job_title: string;
  experience_years: number;
  expected_salary: number;
  district: string;
  town: string;
  languages: string[];
  willing_to_relocate: boolean;
}

export interface EducationHistory {
  id?: number;
  level: string;
  qualification: string;
  institution: string;
  year_completed: number;
}

export interface WorkExperience {
  id?: number;
  organisation: string;
  role: string;
  start_date: string;
  end_date: string | null;
  contract_type: "full-time" | "part-time" | "contract" | "freelance";
  description: string;
}

export interface SkillProficiency {
  id: number;
  name?: string;
  proficiency_level: "beginner" | "intermediate" | "expert";
  years_of_experience: number;
}

export interface SkillsInterestsPayload {
  skills: SkillProficiency[];
  interests: number[]; // IDs
  job_categories: number[]; // IDs
}
