import { prisma } from "@/server/db";
import dynamic from "next/dynamic";
import React from "react";
import { MountainLineRoutes } from "@/data/MountainLineRoutes";
import { jitter } from "@/app/map/utils";
import { createBusRoute } from "@/app/api/bus-routes/route";
const OrganizationMap = dynamic(
  () => import("@/components/map/OrganizationMapPage"),
  {
    loading: () => <p>loading...</p>,
    ssr: false,
  }
);

const getLocationData = async (category: string) => {
  const locations = await prisma.location.findMany({
    where: {
      NOT: {
        latitude: null,
        longitude: null,
      },
      orgId: {
        not: null,
      },
      org: {
        categories: {
          some: {
            slug: category,
          },
        },
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
        select: {
          name: true,
          id: true,
          description: true,
          category: true,
          categories: true,
          tags: true,
          website: true,
          phone: true,
          email: true,
          programs: {
            where: {
              category: category,
            },
            select: {
              name: true,
              description: true,
              id: true,
              category: true,
              tags: true,
              exclusiveToCommunities: true,
              helpfulToCommunities: true,
              phone: true,
              url: true,
              organizationId: true,
            },
          },
        },
      },
    },
  });
  return locations;
};

export type LocationData = Awaited<ReturnType<typeof getLocationData>>;

async function Page({ params }: { params: { category: string } }) {
  const categoryName = await prisma.category.findUnique({
    where: {
      slug: params.category,
    },
    select: {
      category: true,
    },
  });

  let locations = await getLocationData(params.category);

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
      category={{ name: categoryName?.category || "", slug: params.category }}
    />
  );
}

export async function generateStaticParams() {
  const slugsJson = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  const slugs = slugsJson.map((x) => x.slug);

  return slugs.map((slug) => {
    return { category: slug };
  });
}

export default Page;
