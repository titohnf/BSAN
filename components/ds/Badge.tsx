import { cn } from "@/lib/utils"

export interface BadgeProps {
  children: React.ReactNode
  variant?:
    | "success"
    | "warning"
    | "critical"
    | "informational"
    | "neutral"
    | "expressive-success"
    | "expressive-warning"
    | "expressive-critical"
    | "expressive-informational"
    | "expressive-neutral"
  size?: "sm" | "md"
  className?: string
}

const variants: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
  informational: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-700",
  "expressive-success": "bg-green-600 text-white",
  "expressive-warning": "bg-yellow-500 text-white",
  "expressive-critical": "bg-red-600 text-white",
  "expressive-informational": "bg-blue-600 text-white",
  "expressive-neutral": "bg-gray-500 text-white",
}

const sizes: Record<string, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
}

export function Badge({ children, variant = "neutral", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
