import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.tsx";
import { demoMode } from "@/constants.ts";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-card text-card-foreground shadow", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-2 md:p-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-medium md:font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 ", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 ", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardFormFooter = (({
                           isSubmitting,
                           isSubmitted,
                           isError,
                           isSuccess
                     }: {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isError: boolean;
  isSuccess: boolean;
}) => {
  return (
    <CardFooter className="flex flex-col justify-between">
      {!isSubmitting && (
        <Button
          disabled={!isError && isSuccess || demoMode}
          type="submit"
          variant="outline"
          className={cn(
            "w-full border transition-none border-green-500 hover:bg-green-500",
            isSubmitted &&
            isError &&
            "border-red-700 hover:border-red-950 hover:bg-red-700",
            isSuccess &&
            !isError &&
            !demoMode &&
            "border border-green-500 hover:border-green-950 bg-green-500 hover:bg-green-500",
            isSuccess &&
            demoMode &&
            "border border-yellow-500 bg-yellow-500",
          )}
        >
          {isSuccess && !isError ? "Saved" : "Save"}
        </Button>
      )}
      {demoMode && (
        <p className="text-sm font-medium text-destructive m-2">
          Demo mode. Data cannot be modified.
        </p>
      )}
    </CardFooter>
  )
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardFormFooter
};
