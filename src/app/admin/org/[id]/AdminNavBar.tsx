"use client"
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
    <div className="flex gap-2">
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
    <Link href={href} className={twMerge(pathname === href ? "font-bold  pr-4" : 'order-2 hover:text-rose-600', className)}>
      {children }
    </Link>
  )
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
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex items-end gap-4 text-xl">
      <h2 className="text-2xl font-bold text-stone-500 pr-16">{orgName}
          <Link className="pl-2 hover:rose-500" href={`/org/${orgId}`}>
            &rarr;
          </Link></h2>
          <AdminNavLink
            href={`/admin/org/${orgId}`}
            pathname={pathname}
          >
            Details
          </AdminNavLink>
          <AdminNavLink
            href={`/admin/org/${orgId}/programs`}
            pathname={pathname}
          >
            Programs
          </AdminNavLink>
        </div>
        <div>
          <NavigateNextPrevious nextOrgId={nextOrgId} prevOrgId={prevOrgId} />
        </div>
      </div>
    </>
  );
}
