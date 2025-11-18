"use client"

import { Download, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function ReportsPage() {
  const jobsData = [
    { month: "Jan", jobs: 45, applications: 120 },
    { month: "Feb", jobs: 52, applications: 145 },
    { month: "Mar", jobs: 61, applications: 180 },
    { month: "Apr", jobs: 58, applications: 165 },
    { month: "May", jobs: 70, applications: 210 },
    { month: "Jun", jobs: 85, applications: 250 },
  ]

  const categoryData = [
    { name: "Software & Tech", value: 35 },
    { name: "Design", value: 25 },
    { name: "Marketing", value: 20 },
    { name: "Engineering", value: 15 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#0d1b8c", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Insights and performance metrics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#0d1b8c] text-white rounded-lg font-semibold hover:bg-[#0a1570] transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Revenue", value: "$125,000", change: "+12.5%" },
          { title: "Active Contracts", value: "48", change: "+8.2%" },
          { title: "Success Rate", value: "94%", change: "+2.1%" },
        ].map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">{stat.title}</span>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs & Applications */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Jobs & Applications Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="jobs" fill="#0d1b8c" radius={[8, 8, 0, 0]} />
              <Bar dataKey="applications" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Jobs by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
