import type { User } from "@/types";

type Role = User["role"] | undefined;

const roleBaseMap: Record<User["role"], string> = {
  employer: "/employer",
  jobseeker: "/jobseeker",
  admin: "/admin",
};

export const getRoleBasePath = (role: Role) => {
  if (!role) return "/jobseeker";
  return roleBaseMap[role] || "/jobseeker";
};

export const getRoleDashboardPath = (role: Role) => {
  const base = getRoleBasePath(role);
  if (role === "jobseeker") return `${base}/jobs`;
  return `${base}/dashboard`;
};

export const getRoleRoute = (role: Role, path: string) => {
  const base = getRoleBasePath(role);
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
