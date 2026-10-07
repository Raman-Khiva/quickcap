import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900",
        secondary:
          "bg-zinc-100 text-zinc-800 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-200",
        outline:
          "border border-zinc-200 text-zinc-700 bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
        amber:
          "bg-amber-50 text-amber-900 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
        emerald:
          "bg-emerald-50 text-emerald-900 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
        indigo:
          "bg-indigo-50 text-indigo-900 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50",
        destructive:
          "bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2.5 py-0.5 text-[0.7rem]",
        lg: "px-3.5 py-1.5 text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: "amber" | "emerald" | "indigo" | "zinc" | "red"
}

function Badge({ className, variant, size, dotColor, children, ...props }: BadgeProps) {
  const getDotStyle = () => {
    switch (dotColor) {
      case "amber":
        return "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
      case "emerald":
        return "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
      case "indigo":
        return "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]"
      case "red":
        return "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
      case "zinc":
        return "bg-zinc-400"
      default:
        return null
    }
  }

  const dotClass = getDotStyle()

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dotClass && <span className={cn("size-1.5 rounded-full shrink-0", dotClass)} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
