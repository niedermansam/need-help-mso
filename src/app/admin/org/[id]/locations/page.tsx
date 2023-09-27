import { prisma } from "@/server/db";
import React from "react";
import { LocationFormSection } from "./LocationForm";

async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const locations = await prisma.location.findMany({
    where: {
      orgId: params.id,
    },
  });

  return <LocationFormSection locations={locations} orgId={params.id} />;
}

export default Page;
