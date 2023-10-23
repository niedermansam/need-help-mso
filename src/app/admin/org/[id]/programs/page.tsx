import { prisma } from "@/server/prisma";
import React from "react";
import AdminProgramSection from "./ProgramForm";
import { ORGANIZATION_SELECT } from "@/components/organization/utils/fetchAllOrgs";

export const dynamic = "force-dynamic";

async function getOrganizationResources(id: string) {
  const orgData = await prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      ...ORGANIZATION_SELECT,
      programs: {
        select: {
          ...ORGANIZATION_SELECT.programs.select,
          organization: {
            select: {
              id: true,
              name: true,
              website: true,
              phone: true,
              email: true,
            },
          },
        },
      },
    },
  });
  return orgData;
}

async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const orgData = await getOrganizationResources(params.id);

  if (!orgData)
    return {
      notFound: true,
    };
  return (
    <div>
      <AdminProgramSection org={orgData} />
    </div>
  );
}

export default Page;
