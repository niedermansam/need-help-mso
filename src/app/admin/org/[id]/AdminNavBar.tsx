"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

export function NavigateNextPrevious({
  nextOrgId,
  prevOrgId,
}: {
  nextOrgId?: string;
  prevOrgId?: string;
}) {
  return (
    <div className="flex gap-2 text-sm ">
      <Link href={`/admin/org/${prevOrgId}`}>&larr; Previous Organization</Link>{" "}
      |<Link href={`/admin/org/${nextOrgId}`}>Next Organization&rarr;</Link>
    </div>
  );
}

function AdminNavLink({
  href,
  pathname,
  children,
  className,
}: {
  href: string;
  pathname: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={twMerge(
        pathname === href ? "pr-4  font-bold" : " hover:text-rose-600",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function AdminNavBar({
  orgId,
  orgName,
  nextOrgId,
  prevOrgId,
}: {
  orgId: string;
  orgName?: string;
  nextOrgId?: string;
  prevOrgId?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div className="flex flex-wrap items-end gap-4 text-xl order-1">
          <h2 className="order-1 pr-16 text-2xl font-bold text-stone-500">
            {orgName}
            <Link className="hover:rose-500 pl-2" href={`/org/${orgId}`}>
              &rarr;
            </Link>
          </h2>
          <div className="order-1 md:order-2 text-base sm:text-lg">
            <AdminNavLink href={`/admin/org/${orgId}`} pathname={pathname}>
              Details
            </AdminNavLink>
            <AdminNavLink
              href={`/admin/org/${orgId}/programs`}
              pathname={pathname}
            >
              Programs
            </AdminNavLink>
          </div>
        </div>
        <div className="md:order-2 ">
          <NavigateNextPrevious nextOrgId={nextOrgId} prevOrgId={prevOrgId} />
        </div>
      </div>
    </>
  );
}
