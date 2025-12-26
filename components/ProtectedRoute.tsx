"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Loader } from "@/components/Loader";
import type { User } from "@/types";
import { getRoleDashboardPath } from "@/lib/roleRoutes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<User["role"]>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, checkOnboarding } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const roleMismatch = useMemo(() => {
    if (!allowedRoles || !user) return false;
    return !allowedRoles.includes(user.role);
  }, [allowedRoles, user]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (roleMismatch) {
      router.replace(getRoleDashboardPath(user.role));
      return;
    }

    if (!pathname.includes("/onboarding")) {
      checkOnboarding().then((completed) => {
        if (!completed) {
          if (user.role === "employer") {
            router.replace("/onboarding/employer/company-details");
          } else {
            router.replace("/onboarding/jobseeker/personal-details");
          }
        }
      });
    }
  }, [checkOnboarding, loading, pathname, roleMismatch, router, user]);

  if (loading || !user || roleMismatch) {
    return <Loader />;
  }

  return <>{children}</>;
}
