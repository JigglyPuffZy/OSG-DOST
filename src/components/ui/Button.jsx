const variants = {
  primary:
    "btn-primary-glow text-white disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed",
  secondary:
    "border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-dost-200 hover:shadow-md hover:text-slate-900",
  danger:
    "border border-red-200 bg-white text-red-700 shadow-sm hover:bg-red-50 hover:border-red-300",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
}

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-3.5 py-2 text-sm rounded-lg",
  lg: "px-4 py-2.5 text-sm rounded-xl",
}

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
