"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/Loader";
import axiosClient from "@/lib/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Briefcase, CheckCircle2, FileCheck, Sparkles } from "lucide-react";

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
}

export default function JobseekerDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Proposal[]>([]);
  const [recommended, setRecommended] = useState<JobItem[]>([]);
  const [profileProgress, setProfileProgress] = useState<number>(0);
  const [savedJobs, setSavedJobs] = useState<JobItem[]>([]);
  const [tab, setTab] = useState<"best" | "recent" | "saved">("best");

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Feed column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h1 className="text-xl font-semibold">EasyJobWall</h1>
          <p className="text-sm text-muted-foreground">Welcome{user?.name ? `, ${user.name}` : ""}. Explore jobs tailored to you.</p>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 px-4 pt-3">
            <button
              onClick={() => setTab("best")}
              className={`px-3 py-2 text-sm rounded-md ${tab === "best" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              Best Matches
            </button>
            <button
              onClick={() => setTab("recent")}
              className={`px-3 py-2 text-sm rounded-md ${tab === "recent" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setTab("saved")}
              className={`px-3 py-2 text-sm rounded-md ${tab === "saved" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          </div>

          <div className="divide-y divide-border">
            {(
              tab === "saved"
                ? savedJobs
                : tab === "recent"
                ? [...recommended].reverse()
                : recommended
            ).map((job) => (
              <div key={job.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.company || "Company"} · {job.location || "Remote/Anywhere"}</div>
                  </div>
                  <button className="text-xs text-primary hover:underline">View</button>
                </div>
              </div>
            ))}
            {recommended.length === 0 && tab !== "saved" && (
              <div className="p-4 text-sm text-muted-foreground">No recommendations yet. Complete your profile to get better matches.</div>
            )}
            {savedJobs.length === 0 && tab === "saved" && (
              <div className="p-4 text-sm text-muted-foreground">You have no saved jobs.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3">Recent applications</h3>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between border-b last:border-0 border-border pb-3">
                <div>
                  <div className="font-medium">{app.job?.title || "Job"}</div>
                  <div className="text-xs text-muted-foreground capitalize">Status: {app.status.replace(/_/g, " ")}</div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-sm text-muted-foreground">You haven't applied to any jobs yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Profile completeness</div>
              <div className="text-2xl font-bold">{profileProgress}%</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Saved Jobs</div>
            <div className="text-xs text-muted-foreground">{savedJobs.length}</div>
          </div>
          <div className="space-y-2">
            {savedJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="text-sm">
                <div className="font-medium">{job.title}</div>
                <div className="text-xs text-muted-foreground">{job.company || "Company"}</div>
              </div>
            ))}
            {savedJobs.length === 0 && (
              <p className="text-sm text-muted-foreground">No saved jobs yet.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Applications</div>
              <div className="text-2xl font-bold">{applications.length}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
