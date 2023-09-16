import { prisma } from '@/server/db'
import React from 'react'
import { OrganizationCard } from '../_components/DisplayCard/server'
import { Return } from '@prisma/client/runtime/library'
import { SearchComponent } from './SearchComponent'

export const fetchAllOrgs = async () => {
  const orgs = await prisma.organization.findMany({
    include: {
      tags: { select: { tag: true } },
      categories: true,
    },
  });

  return orgs
}

export type OrganizationSearchProps = Awaited<ReturnType<typeof fetchAllOrgs>>

async function Page() {
  const orgs = await prisma.organization.findMany({
    include: {
      tags: true,
      categories: true,
    }
  })


  return (
    <div>
      <h1>Search</h1>
      <SearchComponent searchOptions={orgs} />
    </div>
  )
}

export default Page