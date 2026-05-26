import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-coral-500 text-white shadow-sm",
        secondary:
          "bg-ocean-100 text-ocean-700 border border-ocean-200",
        destructive:
          "bg-red-100 text-red-700 border border-red-200",
        outline:
          "border border-gray-200 text-gray-700 bg-white",
        success:
          "bg-green-100 text-green-700 border border-green-200",
        warning:
          "bg-amber-100 text-amber-700 border border-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
