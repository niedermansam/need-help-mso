import { prisma } from '@/server/prisma'
import React from 'react'
import UpdateTag from './UpdateTag'
import { api } from '@/utils/api'
import TagOptions from './TagOptions'

export const revalidate = 0;

async function Page() {
    const tags = await prisma.tag.findMany()


  return (
    <div>
        <TagOptions category='Food' />
        {
            tags.map(tag => (
                <UpdateTag key={tag.tag} tag={tag.tag} />
            ))
        }
    </div>
  )
}

export default Page