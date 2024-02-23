/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react/prop-types */
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { demoMode } from '@/constants';
import { twMerge } from 'tailwind-merge';
import Loading from './loading';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('bg-card text-card-foreground shadow', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('flex flex-col space-y-1.5 p-2 md:p-0', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge(
      'font-medium md:font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge('p-6 pt-0 ', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('flex items-center p-6 pt-0 ', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

function CardFormFooter({
  isSubmitting,
  submitted,
  isSubmittedSuccessfully,
  isError,
}: {
  isSubmitting: boolean;
  submitted: boolean;
  isSubmittedSuccessfully: boolean;
  isError: boolean;
}) {
  return (
    <CardFooter className="flex flex-col justify-between">
      <Loading loading={isSubmitting}>
        <Button
          disabled={demoMode || isSubmittedSuccessfully}
          type="submit"
          variant="outline"
          className={twMerge(
            'w-full border transition-none border-green-500 hover:bg-green-500',
            isSubmittedSuccessfully &&
              demoMode &&
              'border border-yellow-500 bg-yellow-500',
            isError &&
              submitted &&
              'border border-destructive bg-destructive hover:bg-destructive shake-animation'
          )}
        >
          {isSubmittedSuccessfully && !isError ? 'Saved! ✅' : 'Save'}
        </Button>
      </Loading>
      {isError && (
        <p className="text-sm font-medium text-destructive m-2">
          Error! Could not save changes. Try again.
        </p>
      )}
      {demoMode && (
        <p className="text-sm font-medium text-destructive m-2">
          Demo mode. Data cannot be modified.
        </p>
      )}
    </CardFooter>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardFormFooter,
};
