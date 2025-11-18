"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEmployerLastStep } from "@/lib/onboardingProgress";

export default function EmployerOnboardingIndex() {
  const router = useRouter();

  useEffect(() => {
    const last = getEmployerLastStep();
    const path = last ? `/onboarding/employer/${last}` : "/onboarding/employer/company-details";
    router.replace(path);
  }, [router]);

  return null;
}
