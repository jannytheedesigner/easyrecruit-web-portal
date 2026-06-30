// types/application.ts

export interface Application {
  id: number;
  job_id: number;
  jobseeker_id: number;
  resume_id?: number;
  cover_letter_id?: number;
  cover_letter?: string;
  status: "applied" | "viewed" | "shortlisted" | "assessed" | "interview" | "rejected" | "hired";
  match_score: number; // 0-100
  match_label: "Excellent Match" | "Good Match" | "Average Match";
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  job?: {
    id: number;
    title: string;
    company_name?: string;
    salary_min?: number;
    salary_max?: number;
    location?: string;
  };
  jobseeker?: {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
    avatar?: string;
    years_of_experience?: number;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ApplicationFilter {
  status?: "applied" | "viewed" | "shortlisted" | "assessed" | "interview" | "rejected" | "hired";
  min_score?: number;
  match_level?: "excellent" | "good" | "average";
}

export interface ApplicationResponse {
  data: Application[];
  total: number;
  per_page: number;
  current_page: number;
}
