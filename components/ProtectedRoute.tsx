"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, checkOnboarding } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user) {
      checkOnboarding().then((completed) => {
        if (!completed && !pathname.includes("/onboarding")) {
          if (user.role === "employer") {
            router.replace("/onboarding/employer/company-details");
          } else {
            router.replace("/onboarding/jobseeker/personal-details");
          }
        }
      });
    } else if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router, pathname, checkOnboarding]);

  if (loading) return <Loader />;

  return <>{children}</>;
}
