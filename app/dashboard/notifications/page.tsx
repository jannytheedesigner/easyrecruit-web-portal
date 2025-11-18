"use client"

import { Bell, Check, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New job application",
      message: "John Doe applied for Senior React Developer position",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Contract signed",
      message: "Contract for Full-stack Developer has been signed",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment received",
      message: "You received $5,000 from TechCorp",
      time: "1 day ago",
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
        </div>
        <button className="px-4 py-2 text-[#0d1b8c] font-semibold hover:underline">Mark all as read</button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.read ? "bg-[#0d1b8c]" : "bg-gray-200"}`}
            >
              <Bell className={`w-5 h-5 ${!notification.read ? "text-white" : "text-gray-600"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            <div className="flex gap-2">
              {!notification.read && (
                <button className="p-2 hover:bg-green-100 rounded-lg transition-colors" title="Mark as read">
                  <Check className="w-5 h-5 text-green-600" />
                </button>
              )}
              <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
