import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        pill: "bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-medium shadow-xs dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        outline:
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
        pillOutline:
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 rounded-full dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        pillSecondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 rounded-full dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        destructive:
          "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100",
      },
      size: {
        default: "h-10 rounded-full px-5 py-2.5 text-sm gap-2",
        xs: "h-7 rounded-full px-3 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 rounded-full px-3.5 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 rounded-full px-6 text-base gap-2.5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-full [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10 rounded-full [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
