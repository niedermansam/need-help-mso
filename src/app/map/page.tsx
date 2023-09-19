import { prisma } from '@/server/db'
import dynamic from 'next/dynamic';
import React from 'react'
import { jitter } from './utils';
const OrganizationMap = dynamic(() => import("./OrganizationMap"), {
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


  return (
    <OrganizationMap locations={locations} />
  )
}

export default Page