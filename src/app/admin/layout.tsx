'use client'
import { useUserStore, userHasPermission } from '@/utils/userStore'
import LoadingPage from '@/components/LoadingPage'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

function Layout({children}: {children: React.ReactNode}) {

    // const admin = useUserStore(state => state.admin)
    const role = useUserStore(state => state.role)
    const loggedIn = useUserStore(state => state.loggedIn)
    const loading = useUserStore(state => state.loading)




    if(!loggedIn) return <LoadingPage />



    const hasPermission = userHasPermission(role, "VOLUNTEER")

    return (
      <>
        {hasPermission ? (
          <div>{children}</div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="pt-16 text-center text-4xl font-bold text-stone-600">
              You are not authorized
              <br /> to view this page.
            </h2>
            {loggedIn && (
              <Link href="/">
                <button className="mt-4 max-w-md rounded bg-rose-600 px-4 py-2 text-white">
                  Go Home
                </button>
              </Link>
            )}
            {!loggedIn && (
              <button
                className="mt-4 max-w-md rounded bg-rose-600 px-4 py-2 text-white"
                onClick={() => void signIn()}
              >
                Login
              </button>
            )}
          </div>
        )}
      </>
    );
}

export default Layout