
export interface Job {
    id: number;
    slug: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    tags: string[];
}

export interface JobFilter {
    category?: string;
    search?: string;
    location?: string;
    type?: string[];
    level?: string[];
    place?: string[];
}

const MOCK_JOBS: Job[] = [
    {
        id: 1,
        slug: "senior-frontend-developer",
        title: "Senior Frontend Developer",
        company: "TechFlow Solutions",
        location: "Lilongwe, Malawi",
        type: "Full-time",
        salary: "MK 1,500,000 - 2,000,000",
        posted: "2 days ago",
        tags: ["Remote", "React", "TypeScript"]
    },
    {
        id: 2,
        slug: "product-designer",
        title: "Product Designer",
        company: "Creative Studio",
        location: "Blantyre, Malawi",
        type: "Contract",
        salary: "MK 800,000 - 1,200,000",
        posted: "5 hours ago",
        tags: ["On-site", "Figma", "UI/UX"]
    },
    {
        id: 3,
        slug: "marketing-manager",
        title: "Marketing Manager",
        company: "Growth Inc.",
        location: "Lilongwe, Malawi",
        type: "Full-time",
        salary: "MK 1,200,000 - 1,800,000",
        posted: "1 week ago",
        tags: ["Hybrid", "SEO", "Strategy"]
    },
    {
        id: 4,
        slug: "backend-engineer",
        title: "Backend Engineer",
        company: "FinTech Africa",
        location: "Remote",
        type: "Full-time",
        salary: "USD 2,000 - 3,500",
        posted: "3 days ago",
        tags: ["Remote", "Node.js", "PostgreSQL"]
    },
];

export const JobService = {
    getJobs: async (filters?: JobFilter): Promise<Job[]> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        let jobs = [...MOCK_JOBS];

        if (filters) {
            if (filters.category) {
                const categoryLower = filters.category.toLowerCase();
                jobs = jobs.filter(job =>
                    job.tags.some(tag => tag.toLowerCase() === categoryLower) ||
                    job.title.toLowerCase().includes(categoryLower)
                );
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                jobs = jobs.filter(job =>
                    job.title.toLowerCase().includes(searchLower) ||
                    job.company.toLowerCase().includes(searchLower)
                );
            }
            // Add other filters as needed
        }

        return jobs;
    },

    getJobBySlug: async (slug: string): Promise<Job | null> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_JOBS.find(job => job.slug === slug) || null;
    }
};
