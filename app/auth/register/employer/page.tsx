// app/register/employer/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import GuestLayout from "@/components/layout/GuestLayout";
import { useAuth } from "@/hooks/useAuth";

export default function EmployerRegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return (
    <GuestLayout>
      <RegisterForm role="employer" />
    </GuestLayout>
  );
}