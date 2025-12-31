"use client"

import { Bell } from "lucide-react"

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
                </div>
                <button className="px-4 py-2 text-[#0d1b8c] font-semibold hover:underline">Mark all as read</button>
            </div>

            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up!</p>
            </div>
        </div>
    )
}
