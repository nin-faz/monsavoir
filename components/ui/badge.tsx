import * as React from "react";
import { cn } from "@/lib/utils";
import { TAG_COLORS } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  onRemove?: () => void;
}

export function Badge({ className, color = "violet", onRemove, children, ...props }: BadgeProps) {
  const colorConfig = TAG_COLORS.find((c) => c.name === color) || TAG_COLORS[0];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-semibold border tracking-widest uppercase",
        colorConfig.bg,
        colorConfig.text,
        colorConfig.border,
        className
      )}
      {...props}
    >
      <span className={cn("w-1 h-1 rounded-full flex-shrink-0", colorConfig.dot)} />
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity" type="button">×</button>
      )}
    </span>
  );
}
