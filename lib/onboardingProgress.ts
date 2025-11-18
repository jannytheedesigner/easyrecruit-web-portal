// lib/onboardingProgress.ts

const KEY_LAST_STEP = "emp_onboarding_last_step";
const KEY_PREFIX_DRAFT = "emp_onboarding_draft_";

export type EmployerStep =
  | "company-details"
  | "company-profile"
  | "documents"
  | "hr-contact"
  | "hiring-goals"
  | "hiring-preferences"
  | "complete";

export function getEmployerLastStep(): EmployerStep | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEY_LAST_STEP) as EmployerStep) || null;
}

export function setEmployerLastStep(step: EmployerStep) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_LAST_STEP, step);
}

export function saveEmployerDraft<T = any>(step: EmployerStep, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_PREFIX_DRAFT + step, JSON.stringify(data));
  } catch {}
}

export function loadEmployerDraft<T = any>(step: EmployerStep): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_PREFIX_DRAFT + step);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearEmployerDraft(step: EmployerStep) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_PREFIX_DRAFT + step);
}

export function clearAllEmployerDrafts() {
  if (typeof window === "undefined") return;
  const keys = Object.keys(localStorage);
  for (const k of keys) {
    if (k.startsWith(KEY_PREFIX_DRAFT)) localStorage.removeItem(k);
  }
}
