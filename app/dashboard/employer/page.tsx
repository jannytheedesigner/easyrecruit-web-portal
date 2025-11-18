"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { Briefcase, Users, FileText, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface EmployerStats {
  total_jobs: number;
  active_jobs: number;
  total_users: number;
  total_contracts: number;
  total_revenue: number;
  pending_payments: number;
  jobs_growth: number;
  users_growth: number;
}

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get("/admin/dashboard/stats");
      setStats(response.data.data);
    } catch (e) {
      console.error("Failed to fetch employer stats", e);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data for now
  const jobsData = [
    { month: "Jan", jobs: 45 },
    { month: "Feb", jobs: 52 },
    { month: "Mar", jobs: 61 },
    { month: "Apr", jobs: 58 },
    { month: "May", jobs: 70 },
    { month: "Jun", jobs: 85 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 16500 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 28000 },
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
      change: stats?.jobs_growth || 0,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: stats?.total_users || 0,
      change: stats?.users_growth || 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Contracts",
      value: stats?.total_contracts || 0,
      change: 8.2,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      change: 12.5,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Feed column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h1 className="text-xl font-semibold">EasyEmployerWall</h1>
          <p className="text-sm text-muted-foreground">Manage jobs, review talent and track performance.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground">Post a Job</button>
            <button className="px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">Browse Talent</button>
            <button className="px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">Review Contracts</button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.change >= 0;
              return (
                <div key={stat.title} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Jobs Posted</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={jobsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#0d21a1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="border border-border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#49b70e" strokeWidth={3} dot={{ fill: "#49b70e", r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">Active Jobs</div>
          <div className="text-2xl font-bold">{stats?.active_jobs || 0}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">Pending Payments</div>
          <div className="text-2xl font-bold">${(stats?.pending_payments || 0).toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-2">Talent Spotlight</div>
          <p className="text-sm text-muted-foreground">Recommended candidates feature will appear here.</p>
        </div>
      </div>
    </div>
  );
}
