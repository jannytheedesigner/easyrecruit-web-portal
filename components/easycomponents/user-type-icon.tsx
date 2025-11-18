import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const userTypeIconVariants = cva(
  "flex items-center justify-center rounded-2xl transition-all duration-200 border border-transparent",
  {
    variants: {
      variant: {
        jobseeker:
          "bg-white border-er-dark text-er-dark rounded-md hover:opacity-90",
        employer:
          "bg-er-secondary border-er-secondary rounded-md text-white hover:opacity-90",
        outlineJobseeker:
          "border-er-dark rounded-md text-er-dark hover:bg-[#F5D800]/10",
        outlineEmployer:
          "border-er-dark rounded-md text-er-dark hover:bg-[#2B008C]/10",
        disabled: "opacity-30 bg-transparent border-[#222]",
      },
      size: {
        sm: "w-12 h-12 p-2",
        md: "w-16 h-16 p-3",
        lg: "w-20 h-20 p-4",
      },
    },
    defaultVariants: {
      variant: "jobseeker",
      size: "md",
    },
  }
);

export interface UserTypeIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof userTypeIconVariants> {
  type: "jobseeker" | "employer";
  active?: boolean;
}

export const UserTypeIcon = ({
  type,
  variant,
  size,
  active = true,
  className,
  ...props
}: UserTypeIconProps) => {
  // Dynamically resolve the correct icon based on user type
  const iconSrc = `/brand-assets/icon-assets/user-type/${type}.svg`;

  const computedVariant = active
    ? variant
    : variant?.startsWith("outline")
      ? "disabled"
      : "disabled";

  return (
    <div
      className={cn(
        userTypeIconVariants({ variant: computedVariant, size }),
        className
      )}
      {...props}
    >
      <Image
        src={iconSrc}
        alt={`${type} icon`}
        width={78}
        height={78}
        className="w-24 h-24 object-contain"
        priority
      />
    </div>
  );
};
