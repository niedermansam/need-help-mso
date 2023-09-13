// import type { Organization } from '@prisma/client'
import React from 'react'
import { SITE_URL } from '@/utils/constants'
import type { Organization } from '@prisma/client'
import { OrganizationCard } from '@/components/DisplayCard'

async function OrganizationPage() {

    const json = await fetch(SITE_URL + '/api/org', {next: {revalidate: 3600 *24}})
    const orgs = await json.json() as (Organization & {tags: {tag: string}[]})[]


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