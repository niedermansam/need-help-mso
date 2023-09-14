// import type { Organization } from '@prisma/client'
import React from "react";
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { OrganizationCard } from "@/app/components/DisplayCard/server";
import { prisma } from "@/server/db";
import { BackButton } from "@/app/components/BackButton";

async function OrganizationPage() {
  const orgs = await prisma.organization.findMany({
    include: {
      tags: { select: { tag: true } },
    },
  });
  return (
    <div>
      <h1 className="text-4xl font-bold text-stone-700"> <BackButton /> All Organizations</h1>
      {orgs.map((org) => (
        <OrganizationCard key={org.id} org={org} />
      ))}
    </div>
  );
}

export default OrganizationPage;
