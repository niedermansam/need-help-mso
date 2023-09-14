// import type { Organization } from '@prisma/client'
import React from 'react'
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { OrganizationCard } from '@/components/DisplayCard'
import { prisma } from '@/server/db'
import {appRouter } from '@/server/api/root'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';

async function OrganizationPage() {

      const session = await getServerSession(authOptions)
      const trpc = appRouter.createCaller({
         prisma,
        session,
      });


    const orgs = await trpc.organization.getAll()

    const admin = session?.user.admin || false;
    const favoritesList = await trpc.user.getFavoriteList()
    const loggedIn = !!session?.user;

  return (
    <div>
        <h1>Organizations</h1>
        {orgs.map( org => <OrganizationCard key={org.id} org={org} admin={admin}  favoriteIds={favoritesList.organizations} loggedIn={loggedIn} />)}
    </div>
  )
}

export default OrganizationPage