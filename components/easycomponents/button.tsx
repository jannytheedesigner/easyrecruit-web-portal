import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                // Primary gradient styles
                primary:
                    "bg-er-primary text-white text-base hover:opacity-90",

                primaryRoundedCorner:
                    "bg-er-primary text-white text-base hover:opacity-90 rounded-md",

                // Blue gradient variant
                blue:
                    "bg-gradient-to-r from-[#3B5BDB] to-[#1E3A8A] text-white hover:opacity-90",

                // Gray (neutral) variant
                gray: "bg-gray-300 text-gray-500 hover:bg-gray-200",

                // Light background variant
                light: "bg-[#EAEAEA] text-[#2B2B2B] hover:bg-[#D5D5D5]",


                // Transparent gradient hover
                ghost:
                    "bg-transparent text-white hover:bg-[#0F006D]/30 border border-transparent",

                // Outline styles
                outlinePrimary:
                    "border border-gray-400 text-gray-600 hover:bg-gray-200 hover:text-gray-600",
                outlineBlue:
                    "border border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white",
                outlineGray:
                    "border border-[#5A5A5A] text-[#BFBFBF] hover:bg-[#5A5A5A] hover:text-white",
                outlineWhite:
                    "border border-white text-white hover:bg-white hover:text-[#0F006D]",
            },

            size: {
                sm: "px-4 py-1.5 text-xs",
                md: "px-5 py-2 text-sm",
                lg: "px-6 py-3 text-sm",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
