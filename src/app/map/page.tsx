import { prisma } from '@/server/db'
import dynamic from 'next/dynamic';
import React from 'react'
import { jitter } from './utils';
import { BusRoute, createBusRoute } from '../api/bus-routes/route';
import { env } from 'process';
import { MountainLineRoutes } from '@/data/MountainLineRoutes';
const OrganizationMap = dynamic(() => import("./OrganizationMapPage"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

const getLocationData = async () => {
  const locations = await prisma.location.findMany({
    where: {
      NOT: {
        latitude: null,
        longitude: null,
      },
      orgId: {
        not: null,
      }
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

async function Page() {

    
    let locations = await getLocationData()

    locations = locations.map((location) => {
      if( !location.latitude || !location.longitude) return location
      return {...location, latitude: jitter(location.latitude), longitude: jitter(location.longitude)}
    })

    //const busRoutesJson = await fetch(env.NEXT_PUBLIC_SITE_URL + '/api/bus-routes')
    // const busRoutes = await busRoutesJson.json() as BusRoute[]

    const busRoutes = MountainLineRoutes.features.map(createBusRoute)


  return (
    <OrganizationMap locations={locations} busRoutes={busRoutes} category={{
      name: "All Organizations",
      slug: "all",
    }} />
  )
}

export default Page