import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.62rem] font-mono uppercase tracking-[0.18em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand text-paper",
        soft: "border-brand-soft/40 bg-brand-soft/20 text-brand",
        gold: "border-gold/40 bg-gold/15 text-gold",
        outline: "border-brand-soft/40 text-brand-soft",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
