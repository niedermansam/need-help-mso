"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFavoriteOrgStore, useUserStore } from "@/utils/userStore";
import { api } from "@/utils/api";

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
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(data?.user?.name || null, !!data?.user?.name, !!data?.user.admin);
  }, [data?.user.name, data?.user.admin, setUser]);

  const loggedIn = useUserStore((state) => state.loggedIn);

  const setFavoriteOrgs = useFavoriteOrgStore((state) => state.setFavoriteOrgs);
  const setFavoriteListId = useFavoriteOrgStore(
    (state) => state.setFavoriteListId
  );

  const { data: favorites } = api.user.getCurrentFavoritesList.useQuery();

  useEffect(() => {
    setFavoriteOrgs(favorites?.organizations || []);
    setFavoriteListId(favorites?.id);
  }, [
    favorites?.organizations,
    setFavoriteOrgs,
    favorites?.id,
    setFavoriteListId,
  ]);

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
            href="/orgs"
            label="Organizations"
            isActive={/\/org/.test(pathname)}
          />
          <NavLink
            href="/map"
            label="Map"
            isActive={/\/map/.test(pathname)}
          />
          {loggedIn && (
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
            onClick={loggedIn ? () => void signOut() : () => void signIn()}
            className={`${
              loggedIn ? "umami--click--sign-out" : "umami--click-sign-in"
            } mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-indigo-800 md:mt-0`}
          >
            {loggedIn ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </nav>
  );
}
