'use client'
import Link from "next/link";
import {  useRouter } from "next/navigation";
import Image from "next/image";

export default function Error() {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-stone-600">
        <Image
          className="-mb-16 pt-12"
          src="/img/logo.png"
          width={150}
          height={150}
          alt=""
        />
        <h1 className="text-[158px] font-extrabold leading-tight text-rose-300">
          404
        </h1>

        <h2 className="-mt-7 text-2xl font-extrabold">
          Sorry, we couldn&apos;t find what you were looking for.
        </h2>

        <BackToSafetyButtons router={router} />
      </div>
    </div>
  );
}

interface BackToSafetyButtonsProps
  extends React.ComponentPropsWithoutRef<"div"> {
    router: ReturnType<typeof useRouter>;
}

export function BackToSafetyButtons({
  router,
  ...props
}: BackToSafetyButtonsProps) {
  return (
    <div className="mt-7 flex" {...props}>
      <button
        type="button"
        className="rounded bg-rose-500 px-4 py-2 text-xl font-bold text-white hover:bg-rose-700"
        onClick={() => router.back()}
      >
        Go Back
      </button>
      <Link
        className="ml-4 rounded bg-rose-500 px-4 py-2 text-xl font-bold text-white hover:bg-rose-700"
        href="/"
      >
        Go Home
      </Link>
    </div>
  );
}
