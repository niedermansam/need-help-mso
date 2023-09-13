'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavLink = ({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`mr-4 mt-4 block text-rose-200 hover:text-white md:mt-0 md:inline-block ${
        isActive ? "font-bold text-white" : ""
      }`}
    >
      {label}
    </Link>
  );
};

export default function NavBar() {
  const session = useSession();
  const pathname = usePathname() || '';
  const userId = session.data?.user?.id;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky z-50 flex w-full flex-wrap items-center justify-between bg-rose-600 px-6 py-2 drop-shadow-lg">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Link href="/" className="text-xl font-semibold tracking-tight">
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
        } transition-height overflow-hidden duration-200 ease-in-out md:h-auto`}
      >
        <div className=" md:flex-grow">
          <NavLink
            href="/about"
            label="About"
            isActive={/\/about/.test(pathname)}
          />
          <NavLink
            href="/resource"
            label="Resources"
            isActive={/\/resource/.test(pathname)}
          />
          <NavLink
            href="/org"
            label="Organizations"
            isActive={/\/org/.test(pathname)}
          />
          <NavLink
            href="/community"
            label="Communities"
            isActive={/\/community/.test(pathname)}
          />
          {userId && (
            <NavLink
              href="/favorites"
              label="Favorites"
              isActive={/\/list/.test(pathname)}
            />
          )}
        </div>
        <div className="flex">
          {
            // userId // uncomment this
            false && ( // and delete this to show the profile link // if user is logged in, show their name and profile pic in the navbar
              <Link href={"/user"} className="mx-2 flex items-center">
                <p className="mx-2 text-white">Your Profile</p>
              </Link>
            )
          }
          <button
            onClick={userId ? () => void signOut() : () => void signIn()}
            className={`${
              userId ? "umami--click--sign-out" : "umami--click-sign-in"
            } mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-indigo-800 md:mt-0`}
          >
            {userId ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </nav>
  );
}
