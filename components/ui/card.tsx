import * as React from "react";

import { cn } from "@/lib/utils";

// Card component styled to match the job board page card style
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Job board style: border-2, border-black, rounded-xl, shadow, bg-white, no default padding or gap
        "bg-white text-black flex flex-col rounded-xl border-2 border-black shadow-md transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

// Header: Use flex-row, items-start, gap-3, pt-5, pb-2 like job board cards
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-row items-start gap-3 pt-5 pb-2 px-6",
        className
      )}
      {...props}
    />
  );
}

// Title: Bold, large by default, as in card titles on job board
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-xl font-bold leading-tight", className)}
      {...props}
    />
  );
}

// Description: Job board uses muted smaller text for descriptions
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-black/70", className)}
      {...props}
    />
  );
}

// Card actions are not always shown on the job board cards, keep minimal
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto", className)}
      {...props}
    />
  );
}

// CardContent: px-6 consistently, vertical spacing handled by parent
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

// CardFooter: flex-row, border-t by parent if used; pt-4, pb-4, px-6 (job board style)
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 pt-4 pb-4", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
