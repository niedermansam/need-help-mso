import { prisma } from "@/server/db";
import React from "react";
import AdminProgramSection from "./ProgramForm";

export const dynamic = "force-dynamic";

async function getOrganizationResources(id: string) {
  const orgData = await prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,

      name: true,
      phone: true,
      email: true,
      website: true,
      programs: 
      {
        include: {
            tags: true,
            organization: true,

        }
      },
      category: true,
      categoryMeta: true,
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
