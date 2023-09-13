import type { Organization } from '@prisma/client'
import React from 'react'
import { SITE_URL } from '@/utils/constants'

async function OrganizationPage() {

    const orgs = await fetch(SITE_URL + '/api/org')
    //const orgsJson = await orgs.json() as Organization[]

    //console.log('datas  here')

  return (
    <div>page</div>
  )
}

export default OrganizationPage