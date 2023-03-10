import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { createTextGradient } from "../styles/createGradient";
import NavBar from "../components/Navbar";

const CallToAction: React.FC = () => {
  return (
    <div className="mt-4 flex w-full justify-around">
      <Link
        className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white shadow-lg transition-all  hover:bg-rose-700 hover:shadow-xl"
        href="https://www.patreon.com/NeedHelpMissoula"
      >
        Support on Patreon
      </Link>
      <Link
        className="rounded-lg bg-rose-200 px-4 py-2 font-bold text-rose-600 shadow transition-all hover:bg-rose-300 hover:shadow-lg"
        href="/timeline"
      >
        Project Timeline
      </Link>
      <Link
        className="rounded-lg bg-stone-200 px-4 py-2 font-bold text-stone-500 transition-all hover:bg-stone-300 hover:shadow-sm"
        href="https://github.com/niedermansam/need-help-mso"
      >
        View on Github
      </Link>
    </div>
  );
};

const Title = () => {
  return (
    <div className=" max-w-lg text-stone-700">
      <h1 className=" flex-grow text-center text-8xl font-extrabold leading-[0.85] tracking-tight">
        <span>Need Help</span>
        <br /> <span className="tracking-wide">Missoula</span>
      </h1>{" "}
      <p className="m-2 text-center tracking-tight">
        <span className=" text-3xl font-bold">
          A Digital Directory of Resources
        </span>{" "}
        <br />{" "}
        <span className="text-2xl tracking-tighter text-stone-400">
          for People Who Could Use a Helping Hand
        </span>
      </p>
    </div>
  );
};

const Description = () => {
  return (
    <div className="ml-8 flex max-w-lg items-center text-stone-900">
      <p className=" text-xl font-light leading-8">
        We hope to be a hub for different organizations and groups that help
        people who need a hand. A place where social workers, case managers, and
        other professionals can find resources for their clients. But right now,
        we're still under construction. Please support this project if you can
        afford to, and check back soon! check out the development timeline for
        more information about when to check back!
      </p>
    </div>
  );
};

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
        <div className="flex h-screen items-center justify-center bg-stone-100">
          <div className="flex max-w-6xl flex-wrap rounded-xl border border-stone-200 bg-white px-6 pb-10 pt-20 shadow-xl">
            <Title />
            <Description />
            <CallToAction />
            <Link
              href="https://niedermansam.github.io/need-help-missoula/"
              target="_blank"
              className="mt-4 w-full text-center text-lg font-light text-rose-400"
            >
              Check out the Minimum Viable Product
            </Link>
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
