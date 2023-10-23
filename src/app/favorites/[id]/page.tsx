import { OrganizationCard } from "@/components/DisplayCard/server";
import React from "react";
import { FavoritesHeader } from "../page";
import { prisma } from "@/server/prisma";
import { ORGANIZATION_SELECT } from "@/components/organization/utils/fetchAllOrgs";

export default async function Page({ params }: { params: { id: string } }) {
  const favoritesList = await prisma.favoritesList.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      organizations: {
        select: ORGANIZATION_SELECT,
      },
    },
  });

  return (
    <div>
      <FavoritesHeader
        name={favoritesList?.name || "Favorites"}
        id={favoritesList?.id || 0}
      />
      {favoritesList?.organizations.map((org) => (
        <OrganizationCard org={org} key={org.id} />
      ))}
    </div>
  );
}
