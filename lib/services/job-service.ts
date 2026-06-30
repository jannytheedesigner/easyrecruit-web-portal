import axiosClient from "@/lib/axiosClient";
import { Job, JobCategory, Skill } from "@/types/job";

export interface JobFilter {
    category?: string;
    search?: string;
    location?: string;
    type?: string[];
    level?: string[];
    place?: string[];
}

export const JobService = {
    getJobs: async (filters?: JobFilter): Promise<Job[]> => {
        try {
            const response = await axiosClient.get("/jobs", { params: filters });
            return response.data.data || response.data || [];
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            return [];
        }
    },

    getJobById: async (id: number): Promise<Job | null> => {
        try {
            const response = await axiosClient.get(`/jobs/${id}`);
            return response.data.data || response.data || null;
        } catch (error) {
            console.error(`Failed to fetch job ${id}`, error);
            return null;
        }
    },

    getCategories: async (): Promise<JobCategory[]> => {
        try {
            const response = await axiosClient.get("/easydata/categories");
            return response.data.data || response.data || [];
        } catch (error) {
            console.error("Failed to fetch categories", error);
            return [];
        }
    },

    getSkills: async (): Promise<Skill[]> => {
        try {
            const response = await axiosClient.get("/easydata/skills");
            return response.data.data || response.data || [];
        } catch (error) {
            console.error("Failed to fetch skills", error);
            return [];
        }
    }
};
