"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { Briefcase, Users, FileText, DollarSign, TrendingUp, TrendingDown, ChevronRight, Plus, Search, Calendar, Clock, Award, Target, Zap, Star, CheckCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/helpers"


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Job {
  id: number;
  title: string;
  status: string;
  created_at: string;
  job_type: string;
}

interface EmployerStats {
  total_users: number;
  total_jobs: number;
  total_contracts: number;
  total_revenue: number;
  active_tickets: number;
  recent_users: User[];
  recent_jobs: Job[];
  recent_contracts: any[];
}

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get("/employer/dashboard/stats");
      // Assuming the response structure matches the user provided JSON directly or is wrapped in data
      setStats(response.data);
    } catch (e) {
      console.error("Failed to fetch employer stats", e);
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const jobsData = [
    { month: "Jan", jobs: 45 },
    { month: "Feb", jobs: 52 },
    { month: "Mar", jobs: 61 },
    { month: "Apr", jobs: 58 },
    { month: "May", jobs: 70 },
    { month: "Jun", jobs: 85 },
  ];

  const applicationsData = [
    { month: "Jan", applications: 120 },
    { month: "Feb", applications: 132 },
    { month: "Mar", applications: 101 },
    { month: "Apr", applications: 154 },
    { month: "May", applications: 190 },
    { month: "Jun", applications: 230 },
  ];

  const jobStatusData = [
    { name: "Active", value: 65, color: "#0d21a1" },
    { name: "Pending", value: 20, color: "#49b70e" },
    { name: "Closed", value: 15, color: "#6366f1" },
  ];

  const recentActivities = [
    { id: 1, action: "New candidate applied", job: "Senior React Developer", time: "10 min ago", icon: Users },
    { id: 2, action: "Contract signed", job: "Project Alpha", time: "1 hour ago", icon: FileText },
    { id: 3, action: "Payment received", job: "Frontend Development", time: "2 hours ago", icon: DollarSign },
    { id: 4, action: "New job posted", job: "UX Designer", time: "1 day ago", icon: Briefcase },
  ];

  const topCandidates = [
    { id: 1, name: "Alex Johnson", role: "Senior Developer", score: 95, status: "Available" },
    { id: 2, name: "Maria Garcia", role: "Product Designer", score: 92, status: "Interviewing" },
    { id: 3, name: "David Chen", role: "DevOps Engineer", score: 89, status: "Available" },
    { id: 4, name: "Sarah Williams", role: "Project Manager", score: 87, status: "Hired" },
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
      title: "Total Jobs",
      value: stats?.total_jobs || 0,
      icon: Briefcase,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Contracts",
      value: stats?.total_contracts || 0,
      icon: FileText,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
    {
      title: "Revenue",
      value: formatCurrency(stats?.total_revenue || 0),
      icon: DollarSign,
      color: "bg-er-primary",
      bgColor: "bg-er-primary/5",
    },
  ];

  const quickActions = [
    { title: "Post New Job", icon: Plus, color: "bg-er-primary text-primary-foreground" },
    { title: "Find Talent", icon: Search, color: "bg-er-complimentary text-white" },
    { title: "Interviews", icon: Calendar, color: "bg-er-secondary-dark text-white" },
    { title: "Contracts", icon: FileText, color: "bg-er-dark text-white" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your team today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={"outline"} className="">
            <Calendar className="w-4 h-4" />
            Schedule
          </Button>
          <Link href={"/employer/jobs/create"}>
            <Button className="">
              <Plus className="w-4 h-4" />
              Create New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendIcon;
          const isPositive = stat.change >= 0;

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
                {/* Trend removed as api does not support it yet */}
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
                <button
                  key={action.title}
                  className={`${action.color} rounded-xl w-full p-3 flex flex-row gap-3 hover:opacity-90 transition-all duration-300`}
                >
                  <div className="p-2 bg-white/20 rounded-md my-auto w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium my-auto flex">{action.title}</span>
                </button>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Jobs Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Jobs Overview
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Monthly job postings</p>
                </div>
                <Link href="/employer/jobs">
                  <Button className="bg-er-primary/5 text-primary py-2 px-4 hover:bg-er-primary/10">
                    View Details <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%" className="">
                  <BarChart data={jobsData}>
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
                      dataKey="jobs"
                      radius={[50, 50, 50, 50]}
                      gradientTransform="90deg"
                      fill="#5662acff"
                    >
                      <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d21a1" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#0d21a1" stopOpacity={0.3} />
                      </linearGradient>
                      <Bar dataKey="jobs" fill="#0d21a1" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Applications Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-er-primary" />
                    Applications Trend
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Monthly candidate applications</p>
                </div>
                <div className="text-sm font-semibold text-green-600">+12.5% vs last month</div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationsData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="applications"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorApps)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-er-secondary" />
                  Recent Activity
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Latest updates from your team</p>
              </div>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors group">
                    <div className="p-3 bg-primary/10 text-primary rounded-md transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{activity.job}</div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Active Jobs & Pending Payments */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-er-secondary/10 border border-er-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-er-secondary text-white rounded-sm">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Jobs</div>
                    <div className="text-2xl font-bold">
                      {stats?.recent_jobs?.filter(j => j.status === 'active').length || 0}
                    </div>
                  </div>
                </div>
                {/* <div className="text-sm font-semibold text-green-600 mr-2">+5 this week</div> */}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-er-complimentary/10 border border-er-complimentary/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-er-complimentary text-white rounded-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Tickets</div>
                    <div className="text-2xl font-bold">{(stats?.active_tickets || 0).toLocaleString()}</div>
                  </div>
                </div>
                <Link href={"/dashboard/"} className="mr-4 text-sm font-medium transition-all duration-200 hover:text-er-complimentary">View All</Link>
              </div>
            </div>
          </div>

          {/* Job Status Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Job Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {jobStatusData.map((status) => (
                <div key={status.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    {status.name}
                  </div>
                  <div className="font-semibold">{status.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Candidates */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-er-complimentary" />
                Top Candidates
              </h3>
              <button className="text-sm text-primary hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-er-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">{candidate.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{candidate.score}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${candidate.status === 'Available' ? 'bg-green-100 text-green-700' : candidate.status === 'Hired' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {candidate.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Performance Score</h3>
                <p className="text-sm text-white/80">Based on all metrics</p>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">87%</div>
              <div className="text-sm text-white/80">Excellent performance</div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-sm">Top 15% of employers this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}