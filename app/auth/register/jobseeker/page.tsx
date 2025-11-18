// app/register/jobseeker/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import GuestLayout from "@/components/layout/GuestLayout";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";

export default function JobseekerRegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <GuestLayout>
      <RegisterForm role="jobseeker" />
    </GuestLayout>
  );
}