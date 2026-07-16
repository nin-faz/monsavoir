import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[#D4B896] dark:border-[#3A2810] bg-[#FDF6E3] dark:bg-[#1F1409] px-4 py-2 text-sm text-[#2C1810] dark:text-[#F5EDD8] placeholder:text-[#B09070] dark:placeholder:text-[#5A3E2A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 font-serif",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
