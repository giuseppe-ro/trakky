import React from "react";

export function Fade({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-aos="fade-up"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="500"
      data-aos-delay="1000"
    >
      {children}
    </div>
  );
}

export function FadeLeft({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-aos="fade-left"
      data-aos-easing="ease-out-cubic"
      data-aos-mirror="true"
      data-aos-delay="500"
      {...props}
    >
      {children}
    </div>
  );
}
