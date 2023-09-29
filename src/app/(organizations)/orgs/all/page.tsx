// import type { Organization } from '@prisma/client'
import React from "react";
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { prisma } from "@/server/db";
import { BackButton } from "@/app/_components/BackButton";
import { SearchComponent } from "@/app/search/SearchComponent";

async function OrganizationPage() {
  const orgs = await prisma.organization.findMany({
    include: {
      tags: { select: { tag: true } },
      categories: true,
      programs: {
        include: {
          tags: true,
          exclusiveToCommunities: true,
          helpfulToCommunities: true,
        },
      },
    },
  });
  return (
    <div>
      <h1 className="text-4xl font-bold text-stone-700">
        {" "}
        <BackButton /> All Organizations
      </h1>
      <SearchComponent searchOptions={orgs} />
    </div>
  );
}

export default OrganizationPage;
