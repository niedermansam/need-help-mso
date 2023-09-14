'use client'
import { OrganizationCard } from '@/app/components/DisplayCard/server'
import LoadingPage from '@/app/components/LoadingPage'
import { api } from '@/utils/api'
import { useFavoriteStore } from '@/utils/userStore'
import React from 'react'

function Page() {

    const favoriteListId = useFavoriteStore(state => state.favoriteListId)

    const {data: favoriteList, isLoading} = api.user.getFavoriteOrganizations.useQuery({listId: favoriteListId || null }, {
        enabled: !!favoriteListId,
    })

    if (isLoading) {
        return <LoadingPage />
    }

  return (
    <div>
      <h1 className='mb-6 text-stone-700" text-4xl font-bold'>
        {favoriteList?.name || "Favorites"}
      </h1>
      {favoriteList?.organizations.map((org) => (
        <OrganizationCard org={org} key={org.id} />
      ))}
    </div>
  );
}

export default Page