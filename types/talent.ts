// types/talent.ts
export interface Talent {
    id: number | string;
    user_id?: number;
    user?: {
        name: string;
        email: string;
        role: string;
    };
    name?: string; // fallback
    email?: string; // fallback
    role?: string; // fallback
    
    current_job_title?: string;
    current_status?: string;
    experience_years?: number;
    expected_salary?: number | string;
    
    district?: string;
    town?: string;
    location?: string; // computed fallback
    
    skills?: Array<{
        id: number;
        name: string;
        pivot?: {
            proficiency_level: string;
            years_of_experience: number;
        }
    }>;
    
    rating?: number;
    profile_views?: number;
    applications?: number;
    is_favorite?: boolean;
    avatar_color?: string;
    created_at: string;
    updated_at?: string;
    availability?: string; // fallback/computed
}
