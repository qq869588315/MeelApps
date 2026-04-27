import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-slate-950 text-white hover:bg-slate-800",
  secondary: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  soft: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  danger: "bg-red-600 text-white hover:bg-red-500"
};

export function buttonClass(
  variant: keyof typeof variants = "primary",
  className?: string
) {
  return cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
