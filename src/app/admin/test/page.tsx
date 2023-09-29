import { prisma } from '@/server/db'
import React from 'react'

async function Page() {

    const orgs = await prisma.organization.findMany({
        include: {
            programs: true
        }
    })
    
    orgs.forEach( async (org, i, arr) => {
        console.log(`Processing ${i + 1} of ${arr.length}`)
        const programCategories = org.programs.map(program => program.category)

        const uniqueCategories = [org.category]

        await prisma.organization.update({
            where: {
                id: org.id
            },
            data: {
                categories: {
                    connectOrCreate: uniqueCategories.map(category => {
                        return {
                            where: {
                                category
                            },
                            create: {
                                category
                            }
                        }
                    })
                }
            }
        })
    })

  return (
    <div>Page</div>
  )
}

export default Page