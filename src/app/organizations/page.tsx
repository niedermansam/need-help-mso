// import type { Organization } from '@prisma/client'
import React from 'react'
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { OrganizationCard } from '@/components/DisplayCard'
import { prisma } from '@/server/db'

async function OrganizationPage() {


    const orgs = await prisma.organization.findMany({
        include: {
            tags: {
                select: {
                    tag: true
                }
            }
        }

    })


    console.log(orgs)

    const admin = false;
    const favoritesList:string[] = []
    const loggedIn = false;

  return (
    <div>
        <h1>Organizations</h1>
        {orgs.map( org => <OrganizationCard key={org.id} org={org} admin={admin}  favoriteIds={favoritesList} loggedIn={loggedIn} />)}
    </div>
  )
}

export default OrganizationPage