"use client"

import { useAuth } from "@/hooks/useAuth"
import { Mail, MapPin, Phone, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/helpers"
import { getRoleDashboardPath } from "@/lib/roleRoutes"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const dashboardHref = getRoleDashboardPath(user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href={dashboardHref} className="text-gray-600 hover:text-gray-900">
              {"<- Back to Dashboard"}
            </Link>
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 bg-[#0d1b8c] text-white rounded-lg font-semibold hover:bg-[#0a1570] transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#0d1b8c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.profile?.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{user.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Joined {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
              {user.profile?.bio ? (
                <p className="text-gray-600 leading-relaxed">{user.profile.bio}</p>
              ) : (
                <p className="text-gray-400 italic">No bio added yet</p>
              )}
            </div>

            {/* Company Info (for employers) */}
            {user.role === "employer" && user.profile?.company_name && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Company Name</label>
                    <p className="font-semibold text-gray-900">{user.profile.company_name}</p>
                  </div>
                  {user.profile.business_email && (
                    <div>
                      <label className="text-sm text-gray-600">Business Email</label>
                      <p className="font-semibold text-gray-900">{user.profile.business_email}</p>
                    </div>
                  )}
                  {user.profile.company_size && (
                    <div>
                      <label className="text-sm text-gray-600">Company Size</label>
                      <p className="font-semibold text-gray-900 capitalize">{user.profile.company_size}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills (for jobseekers) */}
            {user.role === "jobseeker" && user.profile?.skills && user.profile.skills.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-[#0d1b8c] rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Account Settings */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0d1b8c] hover:bg-blue-50 transition-all"
                >
                  <span className="font-medium text-gray-900">Edit Profile</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/profile/password"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0d1b8c] hover:bg-blue-50 transition-all"
                >
                  <span className="font-medium text-gray-900">Change Password</span>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
