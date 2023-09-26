import { prisma } from '@/server/db'
import React from 'react'

async function Page() {
  const users =  await prisma.user.findMany({})
  return (
    <div>
      <h1
       className='text-4xl font-bold  text-stone-600'
      >Users</h1>
      {
        users.map(user => {
          return (
            <div key={user.id}>
              <h2 className='text-2xl font-bold text-stone-600'>{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.admin && "admin"}</p>
            </div>
          )
        })
      }
    </div>
  )
}


export default Page
