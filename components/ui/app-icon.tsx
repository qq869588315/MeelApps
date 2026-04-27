import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-fuchsia-600",
  "from-orange-500 to-amber-600",
  "from-slate-600 to-slate-900"
];

export function AppIcon({
  name,
  iconUrl,
  size = "md",
  colorIndex = 0
}: {
  name: string;
  iconUrl?: string | null;
  size?: "sm" | "md" | "lg";
  colorIndex?: number;
}) {
  const sizes = {
    sm: "h-11 w-11 rounded-lg text-xs",
    md: "h-14 w-14 rounded-lg text-sm",
    lg: "h-24 w-24 rounded-2xl text-2xl"
  };
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className={cn(sizes[size], "shrink-0 object-cover shadow-sm")}
      />
    );
  }

  return (
    <div
      className={cn(
        sizes[size],
        "flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white shadow-sm",
        colors[colorIndex % colors.length]
      )}
    >
      {initials || <Package className="h-5 w-5" />}
    </div>
  );
}
