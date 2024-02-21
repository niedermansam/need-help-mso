import { OrganizationCard } from "@/components/DisplayCard/server";
import {
  ORGANIZATION_SELECT,
  PROGRAM_SELECT,
} from "@/components/organization/utils/fetchAllOrgs";
import { prisma } from "@/server/prisma";
import React from "react";

export const revalidate = 0;

async function Page() {
  const orgs = await prisma.organization.findMany({
    where: {
      adminVerified: true,
    },
    select: ORGANIZATION_SELECT,
  });
  return (
    <div>
      {orgs.map((org) => {
        return (
          <OrganizationCard
            key={org.id}
            org={org}
            programInclude={{
              name: true,
              description: true,
              tags: true,
              category: true,
            }}
            hightlightPrograms={true}
            search={""}
            tagOptions={{
              selected: new Set(),
              hidden: new Set(),
            }}
          />
        );
      })}
    </div>
  );
}

export default Page;
