import { prisma } from "@/server/prisma";
import React from "react";
import { AdminNavBar } from "./AdminNavBar";

async function layout({
  params,
  children,
}: {
  params: {
    id: string;
  };
  children: React.ReactNode;
}) {
  const orgName = await prisma.organization.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
    },
  });
  const nextOrg = await prisma.organization.findFirst({
    where: {
      id: {
        gt: params.id,
      },
    },
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const prevOrg = await prisma.organization.findFirst({
    where: {
      id: {
        lt: params.id,
      },
    },
    select: {
      id: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div>
      <AdminNavBar
        orgId={params.id}
        orgName={orgName?.name}
        nextOrgId={nextOrg?.id}
        prevOrgId={prevOrg?.id}
      />
      {children}
    </div>
  );
}

export default layout;
