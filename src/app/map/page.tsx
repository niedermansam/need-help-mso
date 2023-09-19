import { prisma } from '@/server/db'
import dynamic from 'next/dynamic';
import React from 'react'
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

    
    const locations = await getLocationData()

  return (
    <OrganizationMap locations={locations} />
  )
}

export default Page