"use client"

import { Check } from "lucide-react"

interface ProgressIndicatorProps {
  steps: string[]
  current: number
}

export default function ProgressIndicator({ steps, current }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {steps.map((step, i) => {
          const isCompleted = i < current
          const isActive = i === current

          return (
            <div
              key={i}
              className={`
                flex items-center gap-2 pl-2 pr-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isCompleted
                  ? "bg-er-complimentary text-white"
                  : isActive
                    ? "bg-er-primary text-white shadow-md"
                    : "bg-muted text-muted-foreground"}
              `}
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all
                  ${isCompleted
                    ? "bg-er-primary text-white"
                    : isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted-foreground/10 text-muted-foreground"}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="whitespace-nowrap">{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
