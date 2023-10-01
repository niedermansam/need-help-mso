"use client";
import { useRouter } from "next/navigation";
import { LoadingAnimation } from "@/components/index";
import { useState, useEffect } from "react";
import Link from "next/link";


export function BackToSafetyButtons({
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
  return (
    <div className="mt-7 flex" {...props}>
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded bg-rose-500 px-4 py-2 text-xl font-bold text-white hover:bg-rose-700"
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

export default function LoadingPage() {

  const [showBackSection, setShowBackSection] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBackSection(true);
    }, 3000);
  }, []);

  return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-60 text-center">
          <h1 className="mb-2 flex items-end text-7xl font-extrabold text-rose-600">
            Loading
            <LoadingAnimation className="flex h-4 items-end" />
          </h1>
          <h2 className="text-2xl font-bold text-stone-600">
            {showBackSection
              ? "Sorry, we're still working on it..."
              : "This might take a moment..."}
          </h2>
          {showBackSection && (
            <h3 className="text-lg text-stone-600">
              You can go back or home if you want.
            </h3>
          )}
          {showBackSection && (
            <BackToSafetyButtons
              className="mt-3 flex justify-center"
            />
          )}
        </div>
      </div>
  );
}
