import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 min-h-[44px] tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[#7B1D1D] text-[#F5EDD8] hover:bg-[#5C1515] shadow-md shadow-[#7B1D1D]/30 border border-[#9B2335]/50",
        gold: "bg-[#C9A84C] text-[#2C1810] hover:bg-[#A07835] shadow-md shadow-[#C9A84C]/30 border border-[#A07835]",
        destructive: "bg-red-800 text-[#F5EDD8] hover:bg-red-900 border border-red-900/50",
        outline: "border border-[#D4B896] dark:border-[#3A2810] bg-[#FDF6E3] dark:bg-[#1F1409] text-[#2C1810] dark:text-[#F5EDD8] hover:bg-[#F5EDD8] dark:hover:bg-[#2A1C0C]",
        secondary: "bg-[#F5EDD8] dark:bg-[#2A1C0C] text-[#2C1810] dark:text-[#F5EDD8] hover:bg-[#EDD9A3] dark:hover:bg-[#3A2810] border border-[#D4B896] dark:border-[#3A2810]",
        ghost: "hover:bg-[#F5EDD8] dark:hover:bg-[#2A1C0C] text-[#8B6F4E] dark:text-[#8B6F4E]",
        link: "text-[#C9A84C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs min-h-[36px]",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
