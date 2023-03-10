import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function NavBar() {
  const session = useSession();
    const userId =session.data?.user?.id;
    const userName = session.data?.user?.name;
    const displayName = userName?.split(" ")[0]; // get the first name of the user (if they have a first and last name
    const userImage = session.data?.user?.image;
    const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex flex-wrap items-center justify-between bg-rose-600 px-6 py-2 drop-shadow-lg fixed z-10 w-full">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Link href='/' className="text-xl font-semibold tracking-tight">
          Need Help Missoula
        </Link>
      </div>
      <div className="block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center rounded border border-rose-400 px-3 py-2 text-rose-200 hover:border-white hover:text-white"
        >
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`block w-full flex-grow md:flex md:w-auto md:items-center   ${
          isOpen ? "h-44" : "h-0"
        } overflow-hidden transition-height duration-200 ease-in-out md:h-auto`}
      >
        <div className=" md:flex-grow">
          <Link
            href="/about"
            className="mt-4 mr-4 block text-rose-200 hover:text-white md:mt-0 md:inline-block"
          >
            About
          </Link>
          <Link
            href="/org"
            className="mt-4 mr-4 block text-rose-200 hover:text-white md:mt-0 md:inline-block"
          >
            Organizations
          </Link>
          <Link
            href="/resources"
            className="mt-4 block text-rose-200 hover:text-white md:mt-0 md:inline-block"
          >
            Resources
          </Link>
        </div>
        <div className="flex">
          {userId && ( // if user is logged in, show their name and profile pic in the navbar 
            <Link href={'/user'} className="flex items-center mx-2">
              <p className="text-white mx-2">Welcome, {displayName}!</p>
            </Link>)}
          <button
            onClick={userId ? () => void signOut() : () => void signIn()}
            className="mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-indigo-800 md:mt-0"
          >
            {userId ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </div>
    </nav>
  );
} 