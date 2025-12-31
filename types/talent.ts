// types/talent.ts
export interface Talent {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    title?: string
    location?: string
    skills?: string[]
    experience?: number
    salary_expectation?: number
    availability?: string
    rating?: number
    profile_views?: number
    applications?: number
    is_favorite?: boolean
    avatar_color?: string
}
