import { prisma } from "@/server/db";
import dynamic from "next/dynamic";
import React from "react";
import { MountainLineRoutes } from "@/data/MountainLineRoutes";
import { jitter } from "@/app/map/utils";
import { createBusRoute } from "@/app/api/bus-routes/route";
import { ORGANIZATION_SELECT } from "@/components/organization/utils/fetchAllOrgs";
const OrganizationMap = dynamic(
  () => import("@/components/map/OrganizationMapPage"),
  {
    loading: () => <p>loading...</p>,
    ssr: false,
  }
);

const getLocationData = async () => {
  const locations = await prisma.location.findMany({
    where: {
      NOT: {
        latitude: null,
        longitude: null,
      },
      orgId: {
        not: null,
      },
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      org: {
        select: ORGANIZATION_SELECT,
      },
    },
  });
  return locations;
};

export type LocationData = Awaited<ReturnType<typeof getLocationData>>;

async function Page({ params }: { params: { category: string } }) {
  let locations = await getLocationData();

  locations = locations.map((location) => {
    if (!location.latitude || !location.longitude) return location;
    return {
      ...location,
      latitude: jitter(location.latitude),
      longitude: jitter(location.longitude),
    };
  });

  //const busRoutesJson = await fetch(env.NEXT_PUBLIC_SITE_URL + '/api/bus-routes')
  // const busRoutes = await busRoutesJson.json() as BusRoute[]

  const busRoutes = MountainLineRoutes.features.map(createBusRoute);

  return (
    <OrganizationMap
      locations={locations}
      busRoutes={busRoutes}
      category={{ name: "All Organizations", slug: params.category }}
    />
  );
}

export default Page;
