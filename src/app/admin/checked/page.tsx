import { OrganizationCard } from "@/components/DisplayCard/server";
import { prisma } from "@/server/db";
import React from "react";

export const revalidate = 0;

async function Page() {
  const orgs = await prisma.organization.findMany({
    where: {
      adminVerified: true,
    },
    include: {
      tags: true,
      programs: {
        include: {
          tags: true,
          exclusiveToCommunities: true,
          helpfulToCommunities: true,
        },
      },
      exclusiveToCommunities: true,
    },
  });
  return (
    <div>
      {orgs.map((org) => {
        return <OrganizationCard key={org.id} org={org} />;
      })}
    </div>
  );
}

export default Page;
