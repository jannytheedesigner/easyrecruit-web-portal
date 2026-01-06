"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Briefcase, CheckCircle2, FileCheck, Sparkles, TrendingUp, Users, DollarSign, Clock, Target, Award, Search, FileText, Bell, Eye, MapPin, Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers";

interface Proposal {
  id: number;
  status: string;
  created_at: string;
  job?: { id: number; title: string; company?: string };
}

interface JobItem {
  id: number;
  title: string;
  company?: string;
  location?: string;
  job_type?: string;
  budget_min?: string;
  budget_max?: string;
}

export default function JobseekerDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Proposal[]>([]);
  const [recommended, setRecommended] = useState<JobItem[]>([]);
  const [profileProgress, setProfileProgress] = useState<number>(0);
  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes, profileRes, onboardRes] = await Promise.all([
        axiosClient.get("/proposals"),
        axiosClient.get("/jobs"),
        axiosClient.get("/profile"),
        axiosClient.get("/auth/onboarding-status"),
      ]);

      setApplications(appsRes.data?.data || appsRes.data || []);
      setRecommended((jobsRes.data?.data || jobsRes.data || []).slice(0, 6));

      const profile = profileRes.data?.data || profileRes.data || {};
      const fields = ["basic", "details"];
      const completed = fields.reduce((acc, f) => acc + (profile?.[f] ? 1 : 0), 0);
      const progress = Math.round((completed / fields.length) * 100) || (onboardRes.data?.completed ? 100 : 50);
      setProfileProgress(Math.min(progress, 100));

      const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
      setSavedJobs(saved);
    } catch (e) {
      console.warn("Failed to load some dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const appCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of applications) counts[a.status] = (counts[a.status] || 0) + 1;
    return counts;
  }, [applications]);

  // Mock data for charts
  const applicationsData = [
    { month: "Jan", applications: 3 },
    { month: "Feb", applications: 5 },
    { month: "Mar", applications: 4 },
    { month: "Apr", applications: 8 },
    { month: "May", applications: 6 },
    { month: "Jun", applications: applications.length },
  ];

  const profileViewsData = [
    { month: "Jan", views: 45 },
    { month: "Feb", views: 52 },
    { month: "Mar", views: 61 },
    { month: "Apr", views: 58 },
    { month: "May", views: 70 },
    { month: "Jun", views: 85 },
  ];

  const applicationStatusData = [
    { name: "Pending", value: appCounts.pending || 0, color: "#f59e0b" },
    { name: "Accepted", value: appCounts.accepted || 0, color: "#10b981" },
    { name: "Rejected", value: appCounts.rejected || 0, color: "#ef4444" },
  ];

  const quickActions = [
    { title: "Complete Profile", icon: FileCheck, color: "bg-er-primary text-primary-foreground", href: "/jobseeker/profile" },
    { title: "Search Jobs", icon: Search, color: "bg-er-complimentary text-white", href: "/jobseeker/jobs" },
    { title: "My Applications", icon: FileText, color: "bg-er-secondary-dark text-white", href: "/jobseeker/applications" },
    { title: "Notifications", icon: Bell, color: "bg-er-dark text-white", href: "/jobseeker/notifications" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Applications",
      value: applications.length,
      icon: Briefcase,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Profile Views",
      value: 85,
      icon: Eye,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Saved Jobs",
      value: savedJobs.length,
      icon: Bookmark,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Profile Score",
      value: `${profileProgress}%`,
      icon: Award,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back{user?.name ? `, ${user.name}` : ""}! Here's your job search progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={"/jobseeker/jobs"}>
            <Button className="">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className={`${stat.bgColor} border border-er-primary/10 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg shadow-er-primary/5 transition-all duration-300`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-8 translate-x-8" />

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-md bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-semibold my-auto">{stat.value}</div>
              </div>

              <div className="space-y-2 flex flex-row">
                <div className="text-sm text-muted-foreground my-auto">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-4 w-full">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} className="w-full">
                  <button
                    className={`${action.color} rounded-xl w-full p-3 flex flex-row gap-3 hover:opacity-90 transition-all duration-300`}
                  >
                    <div className="p-2 bg-white/20 rounded-md my-auto w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium my-auto flex">{action.title}</span>
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Applications Trend
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Monthly applications</p>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%" className="">
                  <BarChart data={applicationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar
                      dataKey="applications"
                      radius={[50, 50, 50, 50]}
                      fill="#5662acff"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profile Views Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-er-primary" />
                    Profile Views
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Monthly profile impressions</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profileViewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-er-secondary" />
                  Recommended Jobs
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Jobs matching your profile</p>
              </div>
              <Link href="/jobseeker/jobs">
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All
                </button>
              </Link>
            </div>
            <div className="space-y-4">
              {recommended.slice(0, 4).map((job) => (
                <div key={job.id} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors group">
                  <div className="p-3 bg-primary/10 text-primary rounded-md">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Building className="w-3 h-3" />
                      {job.company || "Company"}
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      {job.location || "Remote"}
                    </div>
                  </div>
                  <Link href={`/jobseeker/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
              {recommended.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No recommendations yet. Complete your profile to get better matches.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Completeness</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-er-primary/10 border border-er-primary/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-er-primary text-white rounded-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-2xl font-bold">{profileProgress}%</div>
                  </div>
                </div>
              </div>
              {profileProgress < 100 && (
                <Link href="/jobseeker/profile">
                  <Button className="w-full">Complete Profile</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Application Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {applicationStatusData.map((status) => (
                <div key={status.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    {status.name}
                  </div>
                  <div className="font-semibold">{status.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-er-complimentary" />
                Recent Applications
              </h3>
              <Link href="/jobseeker/applications">
                <button className="text-sm text-primary hover:underline">See All</button>
              </Link>
            </div>
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                  <div>
                    <div className="font-medium text-sm">{app.job?.title || "Job"}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">
                      {app.status.replace(/_/g, " ")}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(app.created_at)}</span>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
