import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] file:text-foreground placeholder:text-muted-foreground selection:bg-er-primary/20 selection:text-er-dark border border-gray-300 dark:border-gray-700 w-full min-w-0 rounded-md bg-transparent px-4 py-3 text-base transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-er-primary focus-visible:ring-[3px] focus-visible:ring-er-primary/40 aria-invalid:border-er-secondary aria-invalid:ring-er-secondary/30 dark:aria-invalid:ring-er-secondary/40 dark:bg-input/30 dark:placeholder:text-gray-400",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
