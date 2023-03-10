import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { createTextGradient } from "../styles/createGradient";
import NavBar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Need Help Missoula</title>
        <meta
          name="description"
          content="Resources & organizations in Missoula, MT for those who need a helping hand."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <NavBar />
        <div className="flex h-screen items-center justify-center bg-stone-50">
          <div className="flex flex-wrap px-6 py-20 bg-white border-stone-200 border rounded-xl shadow-xl">
            <div className=" max-w-lg text-stone-700">
              <h1 className=" flex-grow text-center text-8xl font-extrabold leading-[0.85] tracking-tight">
                <span>Need Help</span>
                <br /> <span className="tracking-wide">Missoula</span>
              </h1>{" "}
              <p className="m-2 text-center text-4xl font-semibold tracking-tight">
                Hi There! Welcome to Need Help Missoula!
              </p>
            </div>
            <div className="ml-4 max-w-lg text-stone-900">
              <p className=" text-xl font-light leading-8">
                We hope to be a hub for different organizations and groups that
                help people who need a hand. A place where social workers, case
                managers, and other professionals can find resources for their
                clients. A place where people can find resources for themselves,
                and where people can find ways to help others. But right now,
                we're still under construction.
              </p>
              <div className="mt-4 flex justify-between">
                <Link
                  className="rounded-lg bg-rose-700 px-4 py-2 font-bold  text-rose-100 shadow-lg"
                  href=""
                >
                  Support on Patreon
                </Link>
                <Link
                  className="rounded-lg bg-rose-200 px-4 py-2 font-bold text-rose-600 shadow"
                  href="/timeline"
                >
                  Project Timeline
                </Link>
                <Link
                  className="rounded-lg bg-stone-200 px-4 py-2 font-bold text-stone-500"
                  href=""
                >
                  View on Github
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
