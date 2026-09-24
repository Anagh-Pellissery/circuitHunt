import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-black text-white hover:bg-gray-800 shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-gray-900 underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-full px-3 text-xs",
    lg: "h-12 rounded-full px-8 text-lg",
    icon: "h-9 w-9",
  }

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
