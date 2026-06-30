"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import axiosClient from "@/lib/axiosClient"
import { Loader } from "@/components/Loader"
import { Lock, User, Save, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function JobseekerSettingsPage() {
    const { user, refreshUser } = useAuth()
    const [activeTab, setActiveTab] = useState("profile")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
    })

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    })
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.profile?.phone || "",
                location: user.profile?.location || "",
                bio: user.profile?.bio || "",
            })
        }
    }, [user])

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: "", text: "" })
        setLoading(true)

        try {
            await axiosClient.put("/profile/basic", profileData)
            await refreshUser()
            setMessage({ type: "success", text: "Profile updated successfully!" })
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: "", text: "" })

        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: "error", text: "New passwords do not match" })
            return
        }

        if (passwordData.new_password.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" })
            return
        }

        setLoading(true)
        try {
            await axiosClient.put("/profile/password", {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                new_password_confirmation: passwordData.confirm_password,
            })
            setMessage({ type: "success", text: "Password changed successfully!" })
            setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password" })
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="space-y-8 container mx-auto">
            {/* Header */}
            <div className="bg-er-primary p-10 rounded-3xl flex flex-col gap-3 shadow-lg shadow-er-primary/20">
                <h1 className="text-3xl font-bold text-white font-display">Account Settings</h1>
                <p className="text-blue-100 mt-1 font-medium">Manage your personal information and security.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-2 sticky top-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all ${activeTab === "profile" ? "bg-er-primary/5 text-er-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                            <User className="w-5 h-5" />
                            Personal Details
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all ${activeTab === "security" ? "bg-er-primary/5 text-er-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Security & Password
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-2xl border text-sm font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <Input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                        <Input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                                        <Input
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                                <Textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={4}
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20 resize-none"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="px-8 py-4 bg-er-primary text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-er-primary-dark transition-colors flex items-center gap-2">
                                    {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "security" && (
                        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">Security & Password</h3>
                                <div className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPw.current ? "text" : "password"}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20 pr-12"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPw({ ...showPw, current: !showPw.current })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-er-primary">
                                                {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPw.new ? "text" : "password"}
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20 pr-12"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPw({ ...showPw, new: !showPw.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-er-primary">
                                                {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPw.confirm ? "text" : "password"}
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-er-primary/20 pr-12"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-er-primary">
                                                {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex pt-4">
                                <button type="submit" disabled={loading} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-black transition-colors flex items-center gap-2">
                                    {loading ? "Updating..." : <><Lock className="w-4 h-4" /> Update Password</>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
