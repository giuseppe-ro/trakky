import React from 'react';

export function FadeDown({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-aos="fade-down"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="500"
    >
      {children}
    </div>
  );
}

export function FadeUp({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-aos="fade-up"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="500"
      data-aos-delay="800"
    >
      {children}
    </div>
  );
}

export function FadeLeft({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-aos="fade-left"
      data-aos-easing="ease-out-cubic"
      data-aos-mirror="true"
      data-aos-delay="500"
    >
      {children}
    </div>
  );
}

export function FadeRight({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-aos="fade-right"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="500"
      data-aos-delay="100"
      className="sticky top-20 z-50"
      {...props}
    >
      {children}
    </div>
  );
}
