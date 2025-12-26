// app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import { getRoleDashboardPath } from "@/lib/roleRoutes";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(getRoleDashboardPath(user.role));
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <OnboardingLayout>
      <LoginForm />
    </OnboardingLayout>
  );
}
