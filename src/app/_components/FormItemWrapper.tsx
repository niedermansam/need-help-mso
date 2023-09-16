import React from "react";
import { twMerge } from "tailwind-merge";

export function FormItemWrapper({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      {...props}
      className={twMerge(`flex flex-col gap-1 py-1 md:col-span-2`, className)}
    >
      {children}
    </div>
  );
}
