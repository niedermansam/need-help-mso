// import type { Organization } from '@prisma/client'
import React from 'react'
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { OrganizationCard } from '@/app/components/DisplayCard/server'
import { prisma } from '@/server/db'
import {appRouter } from '@/server/api/root'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';

async function OrganizationPage() {



    const orgs = await prisma.organization.findMany({
        include: {
            tags: {select: {tag: true}},
        }
    })

    // const session = await getServerSession(authOptions)

    const admin = false;
    const favoritesList:string[] = [];
    const loggedIn = false;

  return (
    <div>
        <h1>Organizations</h1>
        {orgs.map( org => <OrganizationCard key={org.id} org={org} admin={admin}  favoriteIds={favoritesList} loggedIn={loggedIn} />)}
    </div>
  )
}

export default OrganizationPage