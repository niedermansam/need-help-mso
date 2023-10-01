'use client'
import { useUserStore } from '@/utils/userStore'
import LoadingPage from '@/components/LoadingPage'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

function Layout({children}: {children: React.ReactNode}) {

    const admin = useUserStore(state => state.admin)
    const loggedIn = useUserStore(state => state.loggedIn)

    if (admin === null) {
        return <LoadingPage />
    }


    if (admin === false ) {
        return <div className='w-full flex justify-center flex-col items-center'>
            <h1 className='text-4xl font-bold pt-16 text-stone-600 text-center'>You are not authorized<br/> to view this page.</h1>
            {loggedIn && <Link href="/"><button className='bg-rose-600 text-white rounded px-4 py-2 mt-4 max-w-md'>Go Home</button></Link>}
            {!loggedIn && <button className='bg-rose-600 text-white rounded px-4 py-2 mt-4 max-w-md' onClick={() => void signIn()}>Login</button>}  
        </div>
    }

  return (
    <>
        {children}
    </>
  )
}

export default Layout