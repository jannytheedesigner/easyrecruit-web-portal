"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import { UsersIcon, Search, Filter, MapPin, Briefcase, Star, Award, Calendar, Mail, Phone, ExternalLink, Eye, MessageSquare, Bookmark, BookmarkCheck, ChevronRight, Download, Sparkles, CalendarDays } from "lucide-react"
import { formatDate } from "@/lib/helpers"
import { Button } from "@/components/easycomponents/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Talent } from "@/types/talent"

export default function TalentDirectoryPage() {
    const [talents, setTalents] = useState<Talent[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState<string>("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [favorites, setFavorites] = useState<string[]>([])

    // Mock data for talents (will be replaced with real API)
    const mockTalents: Talent[] = [
        {
            id: "1",
            name: "Alex Johnson",
            email: "alex.johnson@email.com",
            role: "jobseeker",
            title: "Senior Frontend Developer",
            location: "San Francisco, CA",
            skills: ["React", "TypeScript", "Next.js", "Tailwind", "GraphQL"],
            experience: 8,
            salary_expectation: 120000,
            availability: "Immediate",
            rating: 4.8,
            profile_views: 245,
            applications: 12,
            is_favorite: true,
            avatar_color: "bg-gradient-to-br from-blue-500 to-blue-600",
            created_at: "2024-01-15T10:30:00Z"
        },
        {
            id: "2",
            name: "Maria Garcia",
            email: "maria.garcia@email.com",
            role: "jobseeker",
            title: "UX/UI Designer",
            location: "New York, NY",
            skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
            experience: 6,
            salary_expectation: 95000,
            availability: "2 Weeks",
            rating: 4.9,
            profile_views: 189,
            applications: 8,
            is_favorite: false,
            avatar_color: "bg-gradient-to-br from-purple-500 to-purple-600",
            created_at: "2024-02-10T14:20:00Z"
        },
        {
            id: "3",
            name: "David Chen",
            email: "david.chen@email.com",
            role: "jobseeker",
            title: "Full Stack Developer",
            location: "Remote",
            skills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
            experience: 7,
            salary_expectation: 110000,
            availability: "1 Week",
            rating: 4.7,
            profile_views: 156,
            applications: 15,
            is_favorite: false,
            avatar_color: "bg-gradient-to-br from-green-500 to-green-600",
            created_at: "2024-01-28T09:15:00Z"
        },
        {
            id: "4",
            name: "Sarah Williams",
            email: "sarah.williams@email.com",
            role: "jobseeker",
            title: "Product Manager",
            location: "Austin, TX",
            skills: ["Agile", "Product Strategy", "Data Analysis", "Roadmapping", "Team Leadership"],
            experience: 9,
            salary_expectation: 135000,
            availability: "Immediate",
            rating: 4.6,
            profile_views: 178,
            applications: 6,
            is_favorite: true,
            avatar_color: "bg-gradient-to-br from-pink-500 to-pink-600",
            created_at: "2024-02-05T11:45:00Z"
        },
        {
            id: "5",
            name: "Michael Brown",
            email: "michael.brown@email.com",
            role: "jobseeker",
            title: "DevOps Engineer",
            location: "Lilongwe, City Center",
            skills: ["Kubernetes", "Terraform", "CI/CD", "Monitoring", "Security"],
            experience: 5,
            salary_expectation: 105000,
            availability: "3 Weeks",
            rating: 4.5,
            profile_views: 134,
            applications: 10,
            is_favorite: false,
            avatar_color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
            created_at: "2024-02-12T16:30:00Z"
        },
        {
            id: "6",
            name: "Emma Davis",
            email: "emma.davis@email.com",
            role: "jobseeker",
            title: "Data Scientist",
            location: "Boston, MA",
            skills: ["Python", "Machine Learning", "SQL", "Tableau", "Statistics"],
            experience: 4,
            salary_expectation: 98000,
            availability: "Immediate",
            rating: 4.8,
            profile_views: 167,
            applications: 7,
            is_favorite: false,
            avatar_color: "bg-gradient-to-br from-red-500 to-red-600",
            created_at: "2024-02-08T13:20:00Z"
        }
    ]

    useEffect(() => {
        fetchTalents()
    }, [])

    const fetchTalents = async () => {
        try {
            // For now, use mock data
            // Later replace with: const response = await axiosClient.get("/talents")
            setTalents(mockTalents)
        } catch (error) {
            console.error("Failed to fetch talents:", error)
            // Fallback to mock data
            setTalents(mockTalents)
        } finally {
            setLoading(false)
        }
    }

    const toggleFavorite = (talentId: string) => {
        setTalents(talents.map(talent =>
            talent.id === talentId
                ? { ...talent, is_favorite: !talent.is_favorite }
                : talent
        ))
        setFavorites(prev =>
            prev.includes(talentId)
                ? prev.filter(id => id !== talentId)
                : [...prev, talentId]
        )
    }

    const filteredTalents = talents.filter((talent) => {
        const matchesSearch =
            talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesFilter = filterRole === "all" || talent.role === filterRole
        return matchesSearch && matchesFilter
    })

    const stats = {
        total: talents.length,
        available: talents.filter(t => t.availability === "Immediate").length,
        premium: talents.filter(t => t.rating && t.rating >= 4.5).length,
        favorites: talents.filter(t => t.is_favorite).length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-er-complimentary p-10 rounded-3xl flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h1 className="text-3xl font-semibold text-white">Hiring Directory</h1>
                                <p className="text-gray-100 mt-1">Discover and connect with top professionals</p>
                            </div>
                        </div>
                    </div>
                    <Button variant={"primaryRoundedCorner"} className="flex flex-row gap-2 bg-er-dark rounded-full text-base py-3 px-4 text-er-white">
                        <Sparkles className="w-5 h-5" />
                        Find Perfect Match
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-er-white rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-700 font-medium">Total Candidate</div>
                                <div className="text-5xl font-medium text-er-dark mt-1">{stats.total}</div>
                            </div>
                            <div className="my-auto flex p-4 bg-er-primary rounded-md">
                                <UsersIcon className="w-10 h-10 stroke-[1px] text-er-white" />
                            </div>

                        </div>
                    </div>
                    <div className="bg-er-white rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-700 font-medium">Immediate Start</div>
                                <div className="text-5xl font-medium text-er-dark mt-1">{stats.available}</div>
                            </div>
                            <div className="my-auto flex p-4 bg-er-dark rounded-md">
                                <Calendar className="w-10 h-10 stroke-[1px] text-er-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-er-white rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-700 font-medium">Top Candidate</div>
                                <div className="text-5xl font-medium text-er-dark mt-1">{stats.premium}</div>
                            </div>
                            <div className="my-auto flex p-4 bg-er-secondary rounded-md">
                                <Award className="w-10 h-10 stroke-[1px] text-er-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-er-white rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-700 font-medium">Saved Candidate</div>
                                <div className="text-5xl font-medium text-er-dark mt-1">{stats.favorites}</div>
                            </div>
                            <div className="my-auto flex p-4 bg-er-complimentary rounded-md">
                                <BookmarkCheck className="w-10 h-10 stroke-[1px] text-er-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Search */}
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, skills, or job title..."
                            className="texts-sm tracking-tight w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-er-primary focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Role Filter */}
                        <div className="flex items-center gap-3">
                            <Select value={filterRole} onValueChange={setFilterRole}>
                                <SelectTrigger className="min-w-48 px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-er-primary focus:border-er-primary bg-gray-50 data-[state=open]:ring-2 data-[state=open]:ring-primary">
                                    <Filter className="w-5 h-5 text-gray-400" />
                                    <SelectValue placeholder="All Talent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Talent</SelectItem>
                                    <SelectItem value="jobseeker">Job Seekers</SelectItem>
                                    <SelectItem value="freelancer">Freelancers</SelectItem>
                                    <SelectItem value="contractor">Contractors</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-md">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-sm ${viewMode === "grid" ? "bg-white" : "hover:bg-gray-200"} transition-colors`}
                            >
                                <div className="w-5 h-5 grid grid-cols-2 gap-1">
                                    <div className="bg-er-primary rounded"></div>
                                    <div className="bg-er-primary rounded"></div>
                                    <div className="bg-er-primary rounded"></div>
                                    <div className="bg-er-primary rounded"></div>
                                </div>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-sm ${viewMode === "list" ? "bg-white" : "hover:bg-gray-200"} transition-colors`}
                            >
                                <div className="w-5 h-5 flex flex-col gap-1">
                                    <div className="bg-gray-400 h-1 rounded-full"></div>
                                    <div className="bg-gray-400 h-1 rounded-full"></div>
                                    <div className="bg-gray-400 h-1 rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        onClick={() => setFilterRole("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterRole === "all" ? "bg-er-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Candidate
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-er-primary border border-blue-200 hover:bg-blue-100 transition-colors">
                        Immediate Start
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 transition-colors">
                        Top Rated (4.5+)
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                        Remote Only
                    </button>
                </div>
            </div>

            {/* Candidate Content */}
            {
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalents.map((talent) => (
                            <div
                                key={talent.id}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-er-primary/15 transition-all duration-300"
                            >
                                {/* Talent Header */}
                                <div className="relative p-6">
                                    <button
                                        onClick={() => toggleFavorite(talent.id)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-white border border-gray-200 rounded-full transition-all"
                                    >
                                        {talent.is_favorite ? (
                                            <BookmarkCheck className="w-5 h-5 text-er-complimentary fill-er-complimentary" />
                                        ) : (
                                            <Bookmark className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                        )}
                                    </button>

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${talent.avatar_color} text-white text-xl`}>
                                            {talent.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0 my-auto">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{talent.name}</h3>
                                                {talent.rating && talent.rating >= 4.5 && (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                        <Star className="w-3 h-3 fill-yellow-500" />
                                                        {talent.rating}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-primary font-medium">{talent.title}</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {talent.skills?.slice(0, 3).map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-er-primary/10 text-er-primary-dark rounded-full text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {talent.skills && talent.skills.length > 3 && (
                                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                +{talent.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-600">Experience</div>
                                            <div className="font-semibold text-gray-900">{talent.experience} years</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600">Expected Salary</div>
                                            <div className="font-semibold text-gray-900">
                                                MWK{talent.salary_expectation?.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600">Availability</div>
                                            <div className="font-semibold text-gray-900">{talent.availability}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600">Location</div>
                                            <div className="font-semibold text-gray-900">{talent.location}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Talent Footer */}
                                <div className="px-4 py-4 mt-auto bg-gray-100 m-3 rounded-md border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{talent.applications} applications</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button className="px-4 py-2 bg-er-primary rounded-full text-white hover:bg-er-primary-light transition-colors text-sm font-medium">
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Candidate</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Role</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Experience</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Salary</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Availability</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTalents.map((talent) => (
                                        <tr key={talent.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${talent.avatar_color} text-white font-bold`}>
                                                        {talent.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{talent.name}</div>
                                                        <div className="text-sm text-gray-600">{talent.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{talent.title}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <MapPin className="w-4 h-4" />
                                                    {talent.location}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-gray-900">{talent.experience} years</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-gray-900">
                                                    ${talent.salary_expectation?.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${talent.availability === "Immediate" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {talent.availability}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleFavorite(talent.id)}
                                                        className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg"
                                                    >
                                                        {talent.is_favorite ? (
                                                            <BookmarkCheck className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                        ) : (
                                                            <Bookmark className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button className="p-2 text-primary hover:bg-blue-50 rounded-lg">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {
                filteredTalents.length === 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No talent found</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                            We couldn't find any professionals matching your criteria. Try adjusting your search or filters.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => { setSearchTerm(""); setFilterRole("all") }}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                            <button className="px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors">
                                Post a Job Instead
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Export/Save Section */}
            {
                filteredTalents.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="text-sm text-gray-600">
                            Found <span className="font-semibold text-gray-900">{filteredTalents.length}</span> matching professionals
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                <Download className="w-4 h-4" />
                                Export List
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                Bulk Message
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    )
}