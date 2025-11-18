"use client"

import { toast as sonnerToast } from "sonner"

type Variant = "default" | "destructive"

interface ToastArgs {
  title: string
  description?: string
  variant?: Variant
}

export function toast({ title, description, variant = "default" }: ToastArgs) {
  const style = variant === "destructive" ? { style: { background: "#fee2e2", color: "#991b1b" } } : {}
  if (description) {
    sonnerToast(title, { description, ...style })
  } else {
    sonnerToast(title, style)
  }
}
