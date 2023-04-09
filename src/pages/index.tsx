import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import NavBar from "../components/Nav";



const CallToAction: React.FC = () => {
  return (
    <div className="m-4 mt-4 flex w-full flex-col justify-around md:flex-row">
      <Link
        className="umami--click--patreon my-2 rounded-lg bg-rose-600 px-4 py-2 font-bold text-white shadow-lg transition-all  hover:bg-rose-700 hover:shadow-xl focus:bg-rose-700 focus:shadow-xl"
        href="https://www.patreon.com/NeedHelpMissoula"
      >
        Support on Patreon
      </Link>
      <Link
        className="umami--click--timeline focus:bg-rose-300 my-2 rounded-lg bg-rose-200 px-4 py-2 font-bold text-rose-600 shadow transition-all hover:bg-rose-300 hover:shadow-lg focus:shadow-lg"
        href="/timeline"
      >
        Project Timeline
      </Link>
      <Link
        className="umami--click--github my-2 rounded-lg bg-stone-200 px-4 py-2 font-bold text-stone-500 transition-all hover:bg-stone-300 hover:shadow-sm focus:bg-stone-300 focus:shadow-sm"
        href="https://github.com/niedermansam/need-help-mso"
      >
        View on Github
      </Link>
    </div>
  );
};

const Title = () => {
  return (
    <div className=" max-w-lg text-stone-700 md:mt-0 lg:w-[45%]">
      <h1 className=" flex-grow text-center text-5xl font-extrabold leading-[0.85] tracking-tight md:text-6xl lg:text-8xl">
        <span>Need&nbsp;Help</span>
        <br /> <span className="tracking-wide text-rose-500">Missoula</span>
      </h1>{" "}
      <p className="my-4 w-full text-center tracking-tight">
        <span className=" text-xl font-bold text-stone-400 md:text-xl lg:text-2xl  ">
          A digital directory of resources for people 
        </span>{" "}
        <br />{" "}
        <span className="text-lg text-stone-400 font-bold md:text-xl lg:text-2xl">
         who could use a helping hand.
        </span>
      </p>
    </div>
  );
};

const Description = () => {
  return (
    <div className="ml-8 flex max-w-full  items-center px-6 text-stone-900 lg:w-[40%] ">
      <p className=" text-xl font-light leading-8">
        We hope to be a hub for different organizations and groups that help
        people who need a hand. A place where social workers, case managers, and
        other professionals can find resources for their clients. But right now,
        we&apos;re still under construction. Check out the development timeline
        for more information about when to check back, and consider supporting
        our efforts on Patreon.
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
        <div className="flex min-h-screen items-center justify-center bg-stone-100 md:p-20">
          <div className="flex max-w-6xl  flex-wrap justify-center rounded-xl border border-stone-200 bg-white  pb-10 pt-20 shadow-xl md:px-6">
            <Title />
            <Description />
            <CallToAction />
            
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
