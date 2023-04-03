import Link from "next/link";
import NavBar from "../components/Nav";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Custom404() {
  const router = useRouter();
  return (
    <div>
      <NavBar />{" "}
      <div className="flex flex-col items-center justify-center text-stone-600">
        <Image className="pt-12 -mb-16" src="/img/logo.png" width={150} height={150} alt="" />
        <h1 className="text-[158px] leading-tight font-extrabold text-rose-300">404</h1>

        <h2 className="-mt-7 text-2xl font-extrabold">
          Sorry, we couldn&apos;t find what you were looking for.
        </h2>
        <div className="mt-7 flex">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded bg-rose-500 py-2 px-4 text-xl font-bold text-white hover:bg-rose-700"
          >
            Go Back
          </button>
          <Link
            className="ml-4 rounded bg-rose-500 py-2 px-4 text-xl font-bold text-white hover:bg-rose-700"
            href="/"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
