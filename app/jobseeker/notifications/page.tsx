"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Mail, Briefcase, FileText, DollarSign, Users } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatRelativeTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axiosClient.get("/notifications");
            setNotifications(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await axiosClient.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosClient.patch("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await axiosClient.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "job":
                return <Briefcase className="w-5 h-5" />;
            case "application":
                return <FileText className="w-5 h-5" />;
            case "payment":
                return <DollarSign className="w-5 h-5" />;
            case "message":
                return <Mail className="w-5 h-5" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "job":
                return "bg-blue-100 text-blue-600";
            case "application":
                return "bg-green-100 text-green-600";
            case "payment":
                return "bg-yellow-100 text-yellow-600";
            case "message":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const filteredNotifications = filter === "unread"
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg relative">
                            <Bell className="w-6 h-6 text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
                        </div>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-blue-700 font-medium">Total Notifications</div>
                            <div className="text-3xl font-bold text-blue-900 mt-1">{notifications.length}</div>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl">
                            <Bell className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-red-700 font-medium">Unread</div>
                            <div className="text-3xl font-bold text-red-900 mt-1">{unreadCount}</div>
                        </div>
                        <div className="p-3 bg-red-500 text-white rounded-xl">
                            <Mail className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white rounded-xl p-2 border border-gray-200 w-fit">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "unread" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <span>{formatRelativeTime(notification.created_at)}</span>
                                                    {!notification.read && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-blue-600 font-medium">New</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!notification.read && (
                                                    <Button
                                                        onClick={() => markAsRead(notification.id)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <Bell className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {filter === "unread" ? "No unread notifications" : "No notifications"}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        {filter === "unread" ? "You're all caught up!" : "You'll see notifications here when you have updates."}
                    </p>
                </div>
            )}
        </div>
    );
}
