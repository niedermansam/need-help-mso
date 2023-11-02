import { prisma } from '@/server/prisma'
import React from 'react'
import UpdateTag from './UpdateTag'

async function Page() {
    const tags = await prisma.tag.findMany()
  return (
    <div>
        {
            tags.map(tag => (
                <UpdateTag key={tag.tag} tag={tag.tag} />
            ))
        }
    </div>
  )
}

export default Page